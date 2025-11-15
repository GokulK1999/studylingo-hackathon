import React, { useState } from 'react';
import './StudyBuddy.css';

function StudyBuddy({ studyText, showToast, apiUrl }) {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = apiUrl || 'http://localhost:5001';

  const languageNames = {
    'en': '🇬🇧 English',
    'es': '🇪🇸 Spanish',
    'fr': '🇫🇷 French',
    'de': '🇩🇪 German',
    'zh': '🇨🇳 Chinese',
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      showToast('⚠️ Please enter a question');
      return;
    }

    if (!studyText) {
      showToast('⚠️ Translate some text first to provide context');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/study-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          context: studyText
        })
      });

      const data = await response.json();

      if (data.success) {
        setChatHistory([...chatHistory, {
          question: question,
          answers: data.answers,
          timestamp: new Date()
        }]);
        setQuestion('');
        showToast('✅ Found relevant content!');
      } else {
        showToast('❌ Failed to get answer');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('❌ Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  return (
    <div className="study-buddy-container">
      <div className="study-buddy-header">
        <h2>🤖 Study Helper</h2>
        <p>Ask about specific topics and see relevant content in multiple languages!</p>
      </div>

      <div className="chat-section">
        {chatHistory.length === 0 ? (
          <div className="empty-state">
            <p>👋 Ask me to find and translate specific concepts from your study material!</p>
            <div className="example-questions">
              <p><strong>Try asking:</strong></p>
              <ul>
                <li>"Show me about algorithms"</li>
                <li>"What about data structures?"</li>
                <li>"Find information on machine learning"</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="chat-history">
            {chatHistory.map((chat, idx) => (
              <div key={idx} className="chat-exchange">
                <div className="user-question">
                  <strong>You:</strong> {chat.question}
                </div>
                <div className="bot-answers">
                  <div className="answers-grid">
                    {Object.entries(chat.answers).map(([lang, answer]) => (
                      <div key={lang} className="answer-card">
                        <div className="answer-lang-badge">{languageNames[lang]}</div>
                        <p>{answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="question-input-section">
        <textarea
          placeholder="Ask about a specific topic in your study material..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          rows="2"
          disabled={loading}
        />
        <button 
          onClick={handleAskQuestion}
          disabled={loading || !studyText}
        >
          {loading ? '🔍 Finding...' : '🔎 Search'}
        </button>
      </div>
    </div>
  );
}

export default StudyBuddy;