import React, { useState, useEffect } from 'react';
import './App.css';

// Animated Chloe Component
function AnimatedChloe() {
  return (
    <svg width="40" height="40" viewBox="0 0 100 100" style={{ animation: 'bounce 2s infinite' }}>
      {/* Head */}
      <circle cx="50" cy="35" r="20" fill="#FFB6C1" />
      
      {/* Ears */}
      <circle cx="35" cy="20" r="12" fill="#FFB6C1" />
      <circle cx="65" cy="20" r="12" fill="#FFB6C1" />
      
      {/* Inner ears */}
      <circle cx="35" cy="22" r="6" fill="#FFC0CB" />
      <circle cx="65" cy="22" r="6" fill="#FFC0CB" />
      
      {/* Eyes */}
      <circle cx="44" cy="32" r="3" fill="#1a1a2e" />
      <circle cx="56" cy="32" r="3" fill="#1a1a2e" />
      
      {/* Nose */}
      <circle cx="50" cy="38" r="2.5" fill="#e91e63" />
      
      {/* Mouth */}
      <path d="M 50 38 Q 48 42 45 41" stroke="#1a1a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 50 38 Q 52 42 55 41" stroke="#1a1a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      
      {/* Body */}
      <ellipse cx="50" cy="60" rx="18" ry="22" fill="#FFB6C1" />
      
      {/* Fluffy chest */}
      <ellipse cx="50" cy="65" rx="14" ry="16" fill="#FFC0CB" />
      
      {/* Tail */}
      <path d="M 65 55 Q 80 50 82 35" stroke="#FFB6C1" strokeWidth="8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('slack');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_N8N_WEBHOOK || 'http://localhost:5000/api/client-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientCode: 'ISS' })
        });
        const result = await response.json();
        setData(result);
        setChatMessages([{ role: 'claude', text: '🐕 Woof! Ask me anything about ISS Client!' }]);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setData({ slack: { messages: [] }, emails: { messages: [] }, meetings: { events: [] } });
        setChatMessages([{ role: 'claude', text: '🐕 Woof! Ready to help!' }]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 4 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !data) return;

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
      const { response: claudeResponse } = await response.json();
      setChatMessages(prev => [...prev, { role: 'claude', text: claudeResponse }]);
    } catch (err) {
      console.error('Chat failed:', err);
      setChatMessages(prev => [...prev, { role: 'claude', text: '🐕 Woof! Error. Try again?' }]);
    } finally {
      setSendingChat(false);
    }
  };

  if (loading) return <div className="loading">🐕 Loading Chloe\'s Dashboard...</div>;
  if (!data) return <div className="error">Failed to load client data</div>;

  const slackMessages = data.slack?.messages || [];
  const emails = data.emails?.messages || [];
  const meetings = data.meetings?.events || [];

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AnimatedChloe />
            <h1>ISS Client Dashboard</h1>
          </div>
          <div className="header-actions">
            <span className="last-updated">Last updated: {data.timestamp ? new Date(data.timestamp).toLocaleString() : 'Now'}</span>
            <button className="refresh-btn" onClick={() => window.location.reload()}>
              ⟳ Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat">
          <div className="stat-value">{slackMessages.length}</div>
          <div className="stat-label">Slack messages</div>
        </div>
        <div className="stat">
          <div className="stat-value">{emails.length}</div>
          <div className="stat-label">Emails</div>
        </div>
        <div className="stat">
          <div className="stat-value">{meetings.length}</div>
          <div className="stat-label">Meetings</div>
        </div>
        <div className="stat">
          <div className="stat-value">{new Set([...slackMessages.map(m => m.user || ''), ...emails.map(e => e.from || '')]).size}</div>
          <div className="stat-label">People</div>
        </div>
      </div>

      {/* Main Content + Chat */}
      <div className="main-container">
        {/* Tabs */}
        <div className="tabs">
          {['slack', 'email', 'meetings', 'summary'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
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
          {activeTab === 'slack' && (
            <div className="messages-list">
              {slackMessages.length === 0 ? (
                <p style={{color: '#999'}}>🐕 No Slack messages yet. Chloe is waiting for data!</p>
              ) : (
                slackMessages.map((msg, idx) => (
                  <div key={idx} className="message slack-message">
                    <div className="message-header">
                      <span className="message-user">{msg.user || 'Unknown'}</span>
                      <span className="message-time">{msg.timestamp || 'N/A'}</span>
                    </div>
                    <div className="message-text">{msg.text || msg.text}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'email' && (
            <div className="messages-list">
              {emails.length === 0 ? (
                <p style={{color: '#999'}}>🐕 No emails yet. Chloe is sniffing for data!</p>
              ) : (
                emails.map((email, idx) => (
                  <div key={idx} className="message email-message">
                    <div className="message-header">
                      <span className="message-user">{email.from || 'Unknown'}</span>
                      <span className="message-time">{email.date || 'N/A'}</span>
                    </div>
                    <div className="message-subject">{email.subject || 'No subject'}</div>
                    <div className="message-text">{email.preview || email.body || 'No preview'}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'meetings' && (
            <div className="messages-list">
              {meetings.length === 0 ? (
                <p style={{color: '#999'}}>🐕 No meetings yet. Chloe is ready when you are!</p>
              ) : (
                meetings.map((meeting, idx) => (
                  <div key={idx} className="message meeting-message">
                    <div className="message-header">
                      <span className="message-user">{meeting.title || 'Meeting'}</span>
                      <span className="message-time">{meeting.date || 'N/A'}</span>
                    </div>
                    <div className="message-text">
                      <strong>Attendees:</strong> {meeting.attendees ? meeting.attendees.join(', ') : 'N/A'}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="summary-section">
              <div className="summary-card">
                <h3>🐕 Chloe\'s Intelligence</h3>
                <p><strong>{slackMessages.length}</strong> Slack | <strong>{emails.length}</strong> Emails | <strong>{meetings.length}</strong> Meetings</p>
              </div>
              <div className="summary-card">
                <h3>Next Steps</h3>
                <p>Set up n8n workflow to sync Slack and Gmail. Chloe will start learning about ISS Client!</p>
              </div>
              <div className="summary-card">
                <h3>Ask Chloe</h3>
                <p>Use the chat below to ask questions. Chloe + Claude AI will help!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Drawer */}
      <div className="chat-drawer">
        <div className="chat-header">
          <h3>🐕 Chloe\'s Chat — Ask about ISS Client</h3>
        </div>
        
        <div className="chat-messages">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>
              <div className="chat-bubble">{msg.text}</div>
            </div>
          ))}
          {sendingChat && <div className="chat-message claude"><div className="chat-bubble">🐕 Thinking...</div></div>}
        </div>

        <form className="chat-input-form" onSubmit={handleSendChat}>
          <input
            type="text"
            placeholder="Ask Chloe anything..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={sendingChat}
            className="chat-input"
          />
          <button type="submit" disabled={sendingChat} className="chat-send-btn">
            {sendingChat ? '...' : '🐕'}
          </button>
        </form>
      </div>
    </div>
  );
}