const express = require('express');
const cors = require('cors');
const { LingoDotDevEngine } = require('lingo.dev/sdk');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Lingo SDK
const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

// Test route
app.get('/', (req, res) => {
  console.log('✅ GET / hit');
  res.json({ message: 'StudyLingo API is running!' });
});

// Translation route with REAL Lingo translations
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguages } = req.body;
    
    console.log('📥 Translation request:', { text, targetLanguages });
    
    if (!process.env.LINGODOTDEV_API_KEY) {
      throw new Error('LINGODOTDEV_API_KEY not set in .env file');
    }

    // Use Lingo's batch translation (translates to multiple languages at once!)
    const translatedTexts = await lingoDotDev.batchLocalizeText(text, {
      sourceLocale: "en",
      targetLocales: targetLanguages,
    });
    
    console.log('✅ Translations completed!');
    
    // Map results to language codes
    const translations = {};
    targetLanguages.forEach((lang, index) => {
      translations[lang] = translatedTexts[index];
    });
    
    res.json({ 
      success: true,
      original: text,
      translations: translations
    });
    
  } catch (error) {
    console.error('❌ Translation error:', error.message);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Lingo API key: ${process.env.LINGODOTDEV_API_KEY ? 'Configured ✓' : 'Missing ✗'}`);
});