* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #fafafa;
  color: #333;
}

.dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
}

/* Header */
.dashboard-header {
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header h1 {
  font-size: 20px;
  font-weight: 500;
  color: #1a1a1a;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.last-updated {
  font-size: 12px;
  color: #999;
}

.refresh-btn {
  background: #378ADD;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.refresh-btn:hover {
  background: #2a6ab3;
}

/* Stats Bar */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: #e0e0e0;
  padding: 1px;
}

.stat {
  background: #ffffff;
  padding: 1.5rem;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 0;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  padding: 0 1.5rem;
}

.tab {
  flex: 0;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #999;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab.active {
  color: #378ADD;
  border-bottom-color: #378ADD;
}

.tab:hover {
  color: #333;
}

/* Main Container */
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Content Area */
.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-left: 3px solid #999;
  border-radius: 4px;
  padding: 12px;
  font-size: 13px;
}

.message.slack-message {
  border-left-color: #4CAF50;
}

.message.email-message {
  border-left-color: #FFC107;
}

.message.meeting-message {
  border-left-color: #2196F3;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.message-user {
  font-weight: 500;
  color: #1a1a1a;
}

.message-time {
  font-size: 11px;
  color: #999;
}

.message-text {
  color: #333;
  line-height: 1.5;
  margin-bottom: 8px;
}

.message-subject {
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.message-reactions {
  font-size: 12px;
  color: #666;
}

.flag {
  font-size: 11px;
  color: #FFC107;
  margin-top: 8px;
  display: inline-block;
}

/* Summary */
.summary-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.summary-card {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1.5rem;
}

.summary-card h3 {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.summary-card p {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

/* Chat Drawer */
.chat-drawer {
  height: 280px;
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.04);
}

.chat-header {
  padding: 12px 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  background: #f9f9f9;
}

.chat-header h3 {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-message {
  display: flex;
  margin-bottom: 8px;
}

.chat-message.user {
  justify-content: flex-end;
}

.chat-message.claude {
  justify-content: flex-start;
}

.chat-bubble {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.5;
  word-wrap: break-word;
}

.chat-message.user .chat-bubble {
  background: #378ADD;
  color: white;
}

.chat-message.claude .chat-bubble {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #e0e0e0;
}

/* Chat Input Form */
.chat-input-form {
  display: flex;
  gap: 8px;
  padding: 12px 1.5rem;
  border-top: 1px solid #e0e0e0;
  background: #f9f9f9;
}

.chat-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 12px;
  font-family: inherit;
  background: #ffffff;
  color: #333;
  transition: border-color 0.2s;
}

.chat-input:focus {
  outline: none;
  border-color: #378ADD;
}

.chat-input:disabled {
  background: #f5f5f5;
  color: #999;
}

.chat-send-btn {
  background: #378ADD;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.chat-send-btn:hover:not(:disabled) {
  background: #2a6ab3;
}

.chat-send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Loading & Error */
.loading,
.error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 14px;
  color: #666;
}

.error {
  color: #d32f2f;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-bar {
    grid-template-columns: repeat(2, 1fr);
  }

  .header-content {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .summary-section {
    grid-template-columns: 1fr;
  }

  .chat-bubble {
    max-width: 90%;
  }
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999;
}