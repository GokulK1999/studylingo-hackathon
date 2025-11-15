import React, { useState, useEffect } from 'react';
import './App.css';
import Visualizations from './Visualizations';
import StudyBuddy from './StudyBuddy';
import Toast from './Toast';

function App() {
  const [text, setText] = useState('');
  const [translations, setTranslations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // check if user has dark mode preference saved
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // save preference
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const languageNames = {
    'es': '🇪🇸 Spanish',
    'fr': '🇫🇷 French',
    'de': '🇩🇪 German',
    'zh': '🇨🇳 Chinese',
    'ar': '🇸🇦 Arabic',
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleTranslate = async () => {
    if (!text.trim()) {
      showToast('⚠️ Please enter some text to translate');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          targetLanguages: ['es', 'fr', 'de', 'zh', 'ar']
        })
      });

      const data = await response.json();
      setTranslations(data);
      showToast('✅ Translation complete!');
    } catch (error) {
      console.error('Error:', error);
      showToast('❌ Translation failed. Check if backend is running!');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showToast('📋 Copied to clipboard!');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    showToast(darkMode ? '☀️ Light mode activated' : '🌙 Dark mode activated');
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div>
            <h1>📚 StudyLingo</h1>
            <p>Learn better through multilingual perspectives</p>
          </div>
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="container">
        <div className="input-section">
          <h2>Enter your study material</h2>
          <textarea
            placeholder="Paste your study notes, article, or any educational content here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="8"
          />
          <button 
            onClick={handleTranslate}
            disabled={loading}
          >
            {loading ? '🔄 Translating...' : '🌍 Translate'}
          </button>
        </div>

        {translations && translations.success && (
          <>
            <div className="output-section">
              <h2>📖 Original Text</h2>
              <div className="translation-card original">
                <p>{translations.original}</p>
              </div>

              <h2>🌍 Translations</h2>
              <div className="translations-grid">
                {Object.entries(translations.translations).map(([lang, translatedText]) => (
                  <div key={lang} className="translation-card">
                    <div className="language-badge">{languageNames[lang]}</div>
                    <p className="translated-text">{translatedText}</p>
                    <button 
                      className="copy-btn"
                      onClick={() => handleCopy(translatedText)}
                    >
                      📋 Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Visualizations 
              originalText={translations.original}
              translations={translations.translations}
            />

            <StudyBuddy studyText={translations.original} showToast={showToast} />
          </>
        )}
      </main>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default App;