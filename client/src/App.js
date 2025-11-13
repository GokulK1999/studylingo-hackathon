import React, { useState } from 'react';
import './App.css';
import Visualizations from './Visualizations';  // Add this line

function App() {
  const [text, setText] = useState('');
  const [translations, setTranslations] = useState(null);
  const [loading, setLoading] = useState(false);

  const languageNames = {
    'es': '🇪🇸 Spanish',
    'fr': '🇫🇷 French',
    'de': '🇩🇪 German',
    'zh': '🇨🇳 Chinese',
    'ar': '🇸🇦 Arabic',
    'ja': '🇯🇵 Japanese',
    'ko': '🇰🇷 Korean',
    'pt': '🇵🇹 Portuguese',
  };

  const handleTranslate = async () => {
    if (!text.trim()) {
      alert('Please enter some text to translate');
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
    } catch (error) {
      console.error('Error:', error);
      alert('Translation failed. Make sure backend is running!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📚 StudyLingo</h1>
        <p>Learn better through multilingual perspectives</p>
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
                      onClick={() => {
                        navigator.clipboard.writeText(translatedText);
                        alert('Copied to clipboard!');
                      }}
                    >
                      📋 Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Visualizations Component */}
            <Visualizations 
              originalText={translations.original}
              translations={translations.translations}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;