import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * AnimatedChloe Component - Real Pomeranian colors
 */
function AnimatedChloe() {
  return (
    <svg 
      width="45" 
      height="45" 
      viewBox="0 0 100 100" 
      style={{ animation: 'bounce 2s infinite', flexShrink: 0 }}
    >
      <circle cx="50" cy="38" r="22" fill="#FF9933" />
      <circle cx="50" cy="48" r="16" fill="#FFFFFF" />
      <ellipse cx="45" cy="32" r="10" ry="12" fill="#FFFFFF" />
      <ellipse cx="55" cy="32" r="10" ry="12" fill="#FFFFFF" />
      <ellipse cx="32" cy="18" rx="10" ry="14" fill="#FF9933" transform="rotate(-25 32 18)" />
      <ellipse cx="68" cy="18" rx="10" ry="14" fill="#FF9933" transform="rotate(25 68 18)" />
      <ellipse cx="32" cy="20" rx="5" ry="8" fill="#FFB366" transform="rotate(-25 32 20)" />
      <ellipse cx="68" cy="20" rx="5" ry="8" fill="#FFB366" transform="rotate(25 68 20)" />
      <circle cx="44" cy="36" r="4" fill="#1a1a2e" />
      <circle cx="56" cy="36" r="4" fill="#1a1a2e" />
      <circle cx="45" cy="35" r="1.5" fill="#FFFFFF" />
      <circle cx="57" cy="35" r="1.5" fill="#FFFFFF" />
      <ellipse cx="50" cy="44" rx="2.5" ry="3" fill="#1a1a2e" />
      <path d="M 50 44 Q 48 48 46 47" stroke="#1a1a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 50 44 Q 52 48 54 47" stroke="#1a1a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="50" rx="2" ry="2.5" fill="#FF6B9D" />
      <ellipse cx="50" cy="65" rx="20" ry="24" fill="#FF9933" />
      <ellipse cx="50" cy="68" rx="16" ry="18" fill="#FFFFFF" />
      <circle cx="42" cy="88" r="4" fill="#FF9933" />
      <circle cx="58" cy="88" r="4" fill="#FF9933" />
    </svg>
  );
}

/**
 * LoadingSkeleton Component - Professional loading state
 */
function LoadingSkeleton() {
  return (
    <div style={{ animation: 'pulse 2s infinite' }}>
      <div style={{ 
        height: '20px', 
        background: '#e0e0e0', 
        borderRadius: '4px', 
        marginBottom: '12px',
        width: '80%'
      }} />
      <div style={{ 
        height: '16px', 
        background: '#f0f0f0', 
        borderRadius: '4px',
        width: '60%'
      }} />
    </div>
  );
}

/**
 * MessageCard - Interactive expandable message
 */
function MessageCard({ message, type = 'slack' }) {
  const [expanded, setExpanded] = useState(false);

  const typeColors = {
    slack: { border: '#4CAF50', icon: '💬' },
    email: { border: '#e91e63', icon: '📧' },
    meeting: { border: '#1a1a2e', icon: '📅' }
  };

  const colors = typeColors[type] || typeColors.slack;

  return (
    <div 
      className="message"
      style={{ borderLeftColor: colors.border, cursor: 'pointer' }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="message-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{colors.icon}</span>
          <span className="message-user">{message.user || message.from || 'User'}</span>
        </div>
        <span className="message-time" style={{ fontSize: '11px' }}>
          {message.timestamp || message.date || 'N/A'}
        </span>
      </div>

      <div className="message-text" style={{ 
        marginTop: '8px',
        maxHeight: expanded ? '500px' : '60px',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease'
      }}>
        {message.text || message.preview || message.subject}
      </div>

      {(message.text?.length > 100 || message.preview?.length > 100) && (
        <div style={{ 
          fontSize: '11px', 
          color: '#e91e63', 
          marginTop: '8px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          {expanded ? '↑ Collapse' : '↓ Expand'}
        </div>
      )}
    </div>
  );
}

/**
 * Main ISS Client Dashboard
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('slack');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);

  // Demo data for interactive feel
  const demoData = {
    slack: {
      messages: [
        { user: 'Emma', text: 'Kickoff meeting went great! Requirements are locked in. Ready to move forward.', timestamp: 'Today 10:15 AM', reactions: ['👍', '🎉'] },
        { user: 'Client PM', text: 'Can we add custom reporting? This would help us track KPIs better.', timestamp: 'Today 10:30 AM', reactions: ['🤔'] },
        { user: 'Client IT', text: 'Data export tool failing on our end, getting 500 errors. Can you help investigate?', timestamp: 'Yesterday 1:30 PM', reactions: ['🚨'] }
      ]
    },
    emails: {
      messages: [
        { from: 'client@iss.com', subject: 'Q1 Strategy Discussion', preview: 'Following up on our call about the quarterly roadmap...', date: 'Today 9:00 AM', flagged: false },
        { from: 'support@iss.com', subject: 'URGENT: Data Export Issue', preview: 'Our team is experiencing issues with the data export functionality...', date: 'Yesterday 2:00 PM', flagged: true }
      ]
    },
    meetings: {
      events: [
        { title: 'ISS Kickoff Call', date: 'Today 2:00 PM', attendees: ['Emma', 'Client PM', 'Client Tech Lead'], description: 'Kickoff meeting to align on project scope and timeline' },
        { title: 'Weekly Sync', date: 'Tomorrow 10:00 AM', attendees: ['Emma', 'Client PM'], description: 'Regular check-in on progress and blockers' }
      ]
    }
  };

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setData(demoData);
      setChatMessages([{ 
        role: 'claude', 
        text: '🐕 Woof! I\'m Chloe, your AI-powered RevOps analyst. Ask me anything about ISS Client!' 
      }]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessages(prev => [...prev, { role: 'user', text: chatInput }]);
    setChatInput('');
    setSendingChat(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        '🐕 Great question! Based on the data, the main blocker is the data export tool failure. Let\'s prioritize that.',
        '🐕 Client sentiment is positive overall! They\'re engaged and collaborative. The flagged email shows some urgency though.',
        '🐕 I see 3 active communications channels and 2 upcoming meetings. The kickoff was successful based on Slack reactions!',
        '🐕 The custom reporting request shows they want deeper analytics. This could be a great upsell opportunity.'
      ];
      setChatMessages(prev => [...prev, { 
        role: 'claude', 
        text: responses[Math.floor(Math.random() * responses.length)]
      }]);
      setSendingChat(false);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="loading">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'bounce 1s infinite' }}>🐕</div>
          <div>Building Chloe's Intelligence Dashboard...</div>
          <div style={{ fontSize: '12px', marginTop: '12px', opacity: 0.6 }}>Syncing client data • Loading AI insights</div>
        </div>
      </div>
    );
  }

  const slackMessages = data?.slack?.messages || [];
  const emails = data?.emails?.messages || [];
  const meetings = data?.meetings?.events || [];

  // Filter messages based on search
  const filteredData = {
    slack: slackMessages.filter(m => m.text?.toLowerCase().includes(searchInput.toLowerCase()) || m.user?.toLowerCase().includes(searchInput.toLowerCase())),
    email: emails.filter(m => m.subject?.toLowerCase().includes(searchInput.toLowerCase()) || m.from?.toLowerCase().includes(searchInput.toLowerCase())),
    meetings: meetings.filter(m => m.title?.toLowerCase().includes(searchInput.toLowerCase()))
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <AnimatedChloe />
            <div>
              <h1>ISS Client Dashboard</h1>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                Powered by Chloe AI • Real-time Intelligence
              </div>
            </div>
          </div>
          <div className="header-actions">
            <span className="last-updated">
              🟢 Live • Last sync: just now
            </span>
            <button 
              className="refresh-btn" 
              onClick={() => window.location.reload()}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>⚡</span> Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat" style={{ background: 'linear-gradient(135deg, rgba(255,153,51,0.1) 0%, transparent 100%)' }}>
          <div className="stat-value">{slackMessages.length}</div>
          <div className="stat-label">Slack Messages</div>
        </div>
        <div className="stat" style={{ background: 'linear-gradient(135deg, rgba(233,30,99,0.1) 0%, transparent 100%)' }}>
          <div className="stat-value">{emails.length}</div>
          <div className="stat-label">Emails</div>
        </div>
        <div className="stat" style={{ background: 'linear-gradient(135deg, rgba(26,26,46,0.1) 0%, transparent 100%)' }}>
          <div className="stat-value">{meetings.length}</div>
          <div className="stat-label">Meetings</div>
        </div>
        <div className="stat" style={{ background: 'linear-gradient(135deg, rgba(78,205,196,0.1) 0%, transparent 100%)' }}>
          <div className="stat-value">{new Set([...slackMessages.map(m => m.user)]).size}</div>
          <div className="stat-label">Team Members</div>
        </div>
      </div>

      {/* Main Content */}
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

        {/* Search Bar */}
        {activeTab !== 'summary' && (
          <div style={{ padding: '1.5rem 2rem', background: '#f9f9f9', borderBottom: '1px solid #e8e8e8' }}>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '10px 14px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '13px',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
        )}

        {/* Content Area */}
        <div className="content-area">
          {activeTab === 'slack' && (
            <div className="messages-list">
              {filteredData.slack.length > 0 ? (
                filteredData.slack.map((msg, idx) => (
                  <MessageCard key={idx} message={msg} type="slack" />
                ))
              ) : (
                <p style={{ color: '#999', textAlign: 'center', marginTop: '2rem' }}>
                  🐕 {searchInput ? 'No messages match your search' : 'Waiting for Slack sync...'}
                </p>
              )}
            </div>
          )}

          {activeTab === 'email' && (
            <div className="messages-list">
              {filteredData.email.length > 0 ? (
                filteredData.email.map((msg, idx) => (
                  <MessageCard key={idx} message={msg} type="email" />
                ))
              ) : (
                <p style={{ color: '#999', textAlign: 'center', marginTop: '2rem' }}>
                  🐕 {searchInput ? 'No emails match your search' : 'Waiting for Gmail sync...'}
                </p>
              )}
            </div>
          )}

          {activeTab === 'meetings' && (
            <div className="messages-list">
              {filteredData.meetings.length > 0 ? (
                filteredData.meetings.map((meeting, idx) => (
                  <div key={idx} className="message meeting-message">
                    <div className="message-header">
                      <span className="message-user">📅 {meeting.title}</span>
                      <span className="message-time">{meeting.date}</span>
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                      <strong>Attendees:</strong> {meeting.attendees.join(', ')}
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '13px', color: '#555' }}>
                      {meeting.description}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#999', textAlign: 'center', marginTop: '2rem' }}>
                  🐕 No meetings found
                </p>
              )}
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="summary-section">
              <div className="summary-card" style={{ cursor: 'pointer' }}>
                <h3>📊 Client Activity</h3>
                <p><strong>{slackMessages.length}</strong> Slack msgs • <strong>{emails.length}</strong> Emails • <strong>{meetings.length}</strong> Meetings</p>
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#999' }}>Click to expand insights</div>
              </div>
              <div className="summary-card" style={{ cursor: 'pointer' }}>
                <h3>🎯 Key Blockers</h3>
                <p>
                  <strong>1 Critical:</strong> Data export tool failure<br/>
                  <strong>1 Pending:</strong> Custom reporting request
                </p>
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#999' }}>Priority: High</div>
              </div>
              <div className="summary-card" style={{ cursor: 'pointer' }}>
                <h3>😊 Sentiment</h3>
                <p><strong>Positive 👍</strong> - Client engaged and collaborative. Some urgency in latest email.</p>
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#999' }}>Based on tone analysis</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Drawer */}
      <div className="chat-drawer">
        <div className="chat-header">
          <h3>🐕 Ask Chloe AI</h3>
        </div>
        
        <div className="chat-messages">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>
              <div className="chat-bubble">{msg.text}</div>
            </div>
          ))}
          {sendingChat && (
            <div className="chat-message claude">
              <div className="chat-bubble">🐕 Analyzing data...</div>
            </div>
          )}
        </div>

        <form className="chat-input-form" onSubmit={handleSendChat}>
          <input
            type="text"
            placeholder="Ask Chloe about ISS Client..."
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