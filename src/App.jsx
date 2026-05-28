import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * AnimatedChloe Component
 * Represents Chloe the Pomeranian mascot with orange & white colors
 * Real colors matching the actual Chloe dog
 */
function AnimatedChloe() {
  return (
    <svg 
      width="45" 
      height="45" 
      viewBox="0 0 100 100" 
      style={{ animation: 'bounce 2s infinite', flexShrink: 0 }}
      aria-label="Chloe the Pomeranian"
    >
      {/* Head - Orange */}
      <circle cx="50" cy="38" r="22" fill="#FF9933" />
      
      {/* White patches on face */}
      <circle cx="50" cy="48" r="16" fill="#FFFFFF" />
      <ellipse cx="45" cy="32" r="10" ry="12" fill="#FFFFFF" />
      <ellipse cx="55" cy="32" r="10" ry="12" fill="#FFFFFF" />
      
      {/* Ears - Orange Pomeranian style */}
      <ellipse cx="32" cy="18" rx="10" ry="14" fill="#FF9933" transform="rotate(-25 32 18)" />
      <ellipse cx="68" cy="18" rx="10" ry="14" fill="#FF9933" transform="rotate(25 68 18)" />
      
      {/* Inner ears - lighter orange */}
      <ellipse cx="32" cy="20" rx="5" ry="8" fill="#FFB366" transform="rotate(-25 32 20)" />
      <ellipse cx="68" cy="20" rx="5" ry="8" fill="#FFB366" transform="rotate(25 68 20)" />
      
      {/* Big cute eyes */}
      <circle cx="44" cy="36" r="4" fill="#1a1a2e" />
      <circle cx="56" cy="36" r="4" fill="#1a1a2e" />
      <circle cx="45" cy="35" r="1.5" fill="#FFFFFF" />
      <circle cx="57" cy="35" r="1.5" fill="#FFFFFF" />
      
      {/* Black nose */}
      <ellipse cx="50" cy="44" rx="2.5" ry="3" fill="#1a1a2e" />
      
      {/* Happy mouth */}
      <path d="M 50 44 Q 48 48 46 47" stroke="#1a1a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 50 44 Q 52 48 54 47" stroke="#1a1a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      
      {/* Tongue - pink */}
      <ellipse cx="50" cy="50" rx="2" ry="2.5" fill="#FF6B9D" />
      
      {/* Body - Orange fluffy */}
      <ellipse cx="50" cy="65" rx="20" ry="24" fill="#FF9933" />
      
      {/* Fluffy white chest */}
      <ellipse cx="50" cy="68" rx="16" ry="18" fill="#FFFFFF" />
      
      {/* Front paws */}
      <circle cx="42" cy="88" r="4" fill="#FF9933" />
      <circle cx="58" cy="88" r="4" fill="#FF9933" />
    </svg>
  );
}

/**
 * Main ISS Client Dashboard Component
 * Displays real-time client intelligence from Slack, Email, and Meetings
 * Features AI-powered chat powered by Claude
 */
export default function App() {
  // State Management
  const [activeTab, setActiveTab] = useState('slack');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);

  /**
   * Fetch client data from n8n webhook
   * Runs on component mount and every 4 hours
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const webhookUrl = process.env.REACT_APP_N8N_WEBHOOK || 'http://localhost:5000/api/client-data';
        
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ clientCode: 'ISS' }),
          timeout: 10000
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const result = await response.json();
        setData({
          slack: result.slack || { messages: [] },
          emails: result.emails || { messages: [] },
          meetings: result.meetings || { events: [] },
          timestamp: new Date().toISOString()
        });

        setChatMessages([{ 
          role: 'claude', 
          text: '🐕 Woof! Chloe here. Ask me anything about ISS Client!' 
        }]);
      } catch (err) {
        console.error('Data fetch error:', err);
        setError(err.message);
        
        // Set fallback empty data
        setData({ 
          slack: { messages: [] }, 
          emails: { messages: [] }, 
          meetings: { events: [] },
          timestamp: new Date().toISOString()
        });

        setChatMessages([{ 
          role: 'claude', 
          text: '🐕 Woof! Ready to help, but waiting for data sync...' 
        }]);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up 4-hour refresh interval
    const interval = setInterval(fetchData, 4 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Handle chat message submission
   * Sends user message to Claude API and displays response
   */
  const handleSendChat = async (e) => {
    e.preventDefault();
    
    if (!chatInput.trim() || !data) {
      return;
    }

    // Add user message
    const userMsg = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setSendingChat(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chatInput,
          clientContext: data
        })
      });

      if (!response.ok) {
        throw new Error('Chat API error');
      }

      const { response: claudeResponse } = await response.json();
      setChatMessages(prev => [...prev, { 
        role: 'claude', 
        text: claudeResponse || '🐕 Woof! Could not generate response.' 
      }]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages(prev => [...prev, { 
        role: 'claude', 
        text: '🐕 Woof! Encountered an error. Please try again!' 
      }]);
    } finally {
      setSendingChat(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐕</div>
          <div>Loading Chloe's Intelligence Dashboard...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <div className="error">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <div>Connection Error</div>
          <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>{error}</div>
        </div>
      </div>
    );
  }

  // Extract data with fallbacks
  const slackMessages = data?.slack?.messages || [];
  const emails = data?.emails?.messages || [];
  const meetings = data?.meetings?.events || [];
  const uniquePeople = new Set([
    ...slackMessages.map(m => m.user || ''),
    ...emails.map(e => e.from || '')
  ]).size;

  return (
    <div className="dashboard">
      {/* Header with Chloe */}
      <header className="dashboard-header">
        <div className="header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <AnimatedChloe />
            <h1>ISS Client Dashboard</h1>
          </div>
          <div className="header-actions">
            <span className="last-updated">
              Last updated: {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : 'Now'}
            </span>
            <button 
              className="refresh-btn" 
              onClick={() => window.location.reload()}
              title="Refresh dashboard"
            >
              ⟳ Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat" title={`Total Slack messages: ${slackMessages.length}`}>
          <div className="stat-value">{slackMessages.length}</div>
          <div className="stat-label">Slack Messages</div>
        </div>
        <div className="stat" title={`Total emails: ${emails.length}`}>
          <div className="stat-value">{emails.length}</div>
          <div className="stat-label">Emails</div>
        </div>
        <div className="stat" title={`Total meetings: ${meetings.length}`}>
          <div className="stat-value">{meetings.length}</div>
          <div className="stat-label">Meetings</div>
        </div>
        <div className="stat" title={`Unique people: ${uniquePeople}`}>
          <div className="stat-value">{uniquePeople}</div>
          <div className="stat-label">People</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-container">
        {/* Tab Navigation */}
        <div className="tabs">
          {['slack', 'email', 'meetings', 'summary'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              aria-selected={activeTab === tab}
              role="tab"
            >
              {tab === 'slack' && '💬 Slack'}
              {tab === 'email' && '📧 Email'}
              {tab === 'meetings' && '📅 Meetings'}
              {tab === 'summary' && '📊 Summary'}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Slack Tab */}
          {activeTab === 'slack' && (
            <div className="messages-list">
              {slackMessages.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center', marginTop: '2rem' }}>
                  🐕 No Slack messages yet. Chloe is waiting for the n8n workflow to sync data!
                </p>
              ) : (
                slackMessages.map((msg, idx) => (
                  <div key={idx} className="message slack-message">
                    <div className="message-header">
                      <span className="message-user">{msg.user || 'Unknown User'}</span>
                      <span className="message-time">{msg.timestamp || 'N/A'}</span>
                    </div>
                    <div className="message-text">{msg.text || 'No content'}</div>
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="message-reactions">{msg.reactions.join(' ')}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="messages-list">
              {emails.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center', marginTop: '2rem' }}>
                  🐕 No emails yet. Chloe is sniffing for messages from andrijana@chloeconsulting.co!
                </p>
              ) : (
                emails.map((email, idx) => (
                  <div key={idx} className="message email-message">
                    <div className="message-header">
                      <span className="message-user">{email.from || 'Unknown Sender'}</span>
                      <span className="message-time">{email.date || 'N/A'}</span>
                    </div>
                    <div className="message-subject">{email.subject || '(No subject)'}</div>
                    <div className="message-text">{email.preview || email.body || 'No preview available'}</div>
                    {email.flagged && <span className="flag">📌 Flagged</span>}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Meetings Tab */}
          {activeTab === 'meetings' && (
            <div className="messages-list">
              {meetings.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center', marginTop: '2rem' }}>
                  🐕 No meetings scheduled yet. Chloe is ready when you are!
                </p>
              ) : (
                meetings.map((meeting, idx) => (
                  <div key={idx} className="message meeting-message">
                    <div className="message-header">
                      <span className="message-user">{meeting.title || 'Untitled Meeting'}</span>
                      <span className="message-time">{meeting.date || 'N/A'}</span>
                    </div>
                    <div className="message-text">
                      <strong>Attendees:</strong> {meeting.attendees?.length > 0 ? meeting.attendees.join(', ') : 'N/A'}
                    </div>
                    {meeting.description && (
                      <div className="message-text" style={{ marginTop: '8px' }}>
                        {meeting.description}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="summary-section">
              <div className="summary-card">
                <h3>🐕 Chloe's Client Intelligence</h3>
                <p>
                  <strong>{slackMessages.length}</strong> Slack messages • 
                  <strong> {emails.length}</strong> Emails • 
                  <strong> {meetings.length}</strong> Meetings
                </p>
              </div>
              <div className="summary-card">
                <h3>Data Integration</h3>
                <p>
                  Next step: Set up n8n workflow to sync Slack (#chloe_managment) and Gmail 
                  (andrijana@chloeconsulting.co). Chloe will auto-update every 4 hours!
                </p>
              </div>
              <div className="summary-card">
                <h3>Ask Chloe AI</h3>
                <p>
                  Use the chat below to ask questions about ISS Client. Chloe + Claude AI 
                  will analyze the data and provide insights.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Drawer */}
      <div className="chat-drawer">
        <div className="chat-header">
          <h3>🐕 Ask Chloe — ISS Client Intelligence</h3>
        </div>
        
        <div className="chat-messages">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>
              <div className="chat-bubble">{msg.text}</div>
            </div>
          ))}
          {sendingChat && (
            <div className="chat-message claude">
              <div className="chat-bubble">🐕 Thinking...</div>
            </div>
          )}
        </div>

        <form className="chat-input-form" onSubmit={handleSendChat}>
          <input
            type="text"
            placeholder="Ask Chloe anything about ISS Client..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={sendingChat}
            className="chat-input"
            aria-label="Chat input"
          />
          <button 
            type="submit" 
            disabled={sendingChat} 
            className="chat-send-btn"
            title="Send message"
          >
            {sendingChat ? '...' : '🐕'}
          </button>
        </form>
      </div>
    </div>
  );
}