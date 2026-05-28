import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('slack');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);

  // Fetch client data
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
        setChatMessages([{ role: 'claude', text: 'Ask me anything about ISS Client!' }]);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setData({ slack: { messages: [] }, emails: { messages: [] }, meetings: { events: [] } });
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
      setChatMessages(prev => [...prev, { role: 'claude', text: 'Error connecting to Claude. Please try again.' }]);
    } finally {
      setSendingChat(false);
    }
  };

  if (loading) return <div className="loading">Loading ISS Client Dashboard...</div>;
  if (!data) return <div className="error">Failed to load client data</div>;

  const slackMessages = data.slack?.messages || [];
  const emails = data.emails?.messages || [];
  const meetings = data.meetings?.events || [];

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>ISS Client Dashboard</h1>
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
                <p style={{color: '#999'}}>No Slack messages yet. Check back after n8n syncs data.</p>
              ) : (
                slackMessages.map((msg, idx) => (
                  <div key={idx} className="message slack-message">
                    <div className="message-header">
                      <span className="message-user">{msg.user || 'Unknown'}</span>
                      <span className="message-time">{msg.timestamp || 'N/A'}</span>
                    </div>
                    <div className="message-text">{msg.text || msg.text}</div>
                    {msg.reactions && <div className="message-reactions">{msg.reactions.join(' ')}</div>}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'email' && (
            <div className="messages-list">
              {emails.length === 0 ? (
                <p style={{color: '#999'}}>No emails yet. Check back after n8n syncs data.</p>
              ) : (
                emails.map((email, idx) => (
                  <div key={idx} className="message email-message">
                    <div className="message-header">
                      <span className="message-user">{email.from || 'Unknown'}</span>
                      <span className="message-time">{email.date || 'N/A'}</span>
                    </div>
                    <div className="message-subject">{email.subject || 'No subject'}</div>
                    <div className="message-text">{email.preview || email.body || 'No preview'}</div>
                    {email.flagged && <span className="flag">📌 Flagged</span>}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'meetings' && (
            <div className="messages-list">
              {meetings.length === 0 ? (
                <p style={{color: '#999'}}>No meetings yet. Check back after n8n syncs data.</p>
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
                    {meeting.description && <div className="message-text">{meeting.description}</div>}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="summary-section">
              <div className="summary-card">
                <h3>Activity Summary</h3>
                <p><strong>{slackMessages.length}</strong> Slack messages | <strong>{emails.length}</strong> Emails | <strong>{meetings.length}</strong> Meetings</p>
              </div>
              <div className="summary-card">
                <h3>Next Steps</h3>
                <p>Set up n8n workflow to sync Slack and Gmail data. Dashboard will auto-update every 4 hours.</p>
              </div>
              <div className="summary-card">
                <h3>Team Chat</h3>
                <p>Use the chat below to ask questions about ISS Client. Powered by Claude AI.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Drawer */}
      <div className="chat-drawer">
        <div className="chat-header">
          <h3>💬 Team Chat — Ask about ISS Client</h3>
        </div>
        
        <div className="chat-messages">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>
              <div className="chat-bubble">{msg.text}</div>
            </div>
          ))}
          {sendingChat && <div className="chat-message claude"><div className="chat-bubble">Thinking...</div></div>}
        </div>

        <form className="chat-input-form" onSubmit={handleSendChat}>
          <input
            type="text"
            placeholder="Ask about the client..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={sendingChat}
            className="chat-input"
          />
          <button type="submit" disabled={sendingChat} className="chat-send-btn">
            {sendingChat ? '...' : '→'}
          </button>
        </form>
      </div>
    </div>
  );
}