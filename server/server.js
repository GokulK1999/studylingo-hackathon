const express = require('express');
const cors = require('cors');
const { LingoDotDevEngine } = require('lingo.dev/sdk');
require('dotenv').config();

const app = express();

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'https://studylingo.vercel.app',
  'https://studylingo-hackathon.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now
    }
  }
}));

app.use(express.json());

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

app.get('/', (req, res) => {
  res.json({ message: 'StudyLingo API is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is healthy' });
});

app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguages } = req.body;
    
    console.log('Translation request received');
    
    if (!process.env.LINGODOTDEV_API_KEY) {
      throw new Error('API key not configured');
    }

    const translatedTexts = await lingoDotDev.batchLocalizeText(text, {
      sourceLocale: "en",
      targetLocales: targetLanguages,
    });
    
    console.log('Translation complete');
    
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
    console.error('Translation error:', error.message);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

app.post('/api/study-chat', async (req, res) => {
  try {
    const { question, context } = req.body;
    
    console.log('Study helper request');
    
    if (!context) {
      return res.status(400).json({ 
        success: false, 
        error: 'Need study context' 
      });
    }

    let relevantText = context;
    
    if (question) {
      const questionWords = question.toLowerCase().split(' ');
      const sentences = context.split(/[.!?]+/);
      
      const matchingSentences = sentences.filter(sentence => {
        const lowerSentence = sentence.toLowerCase();
        return questionWords.some(word => 
          word.length > 3 && lowerSentence.includes(word)
        );
      });

      if (matchingSentences.length > 0) {
        relevantText = matchingSentences.slice(0, 2).join('. ').trim();
      } else {
        relevantText = sentences.slice(0, 2).join('. ').trim();
      }
    }

    if (relevantText.length > 300) {
      relevantText = relevantText.substring(0, 300) + '...';
    }

    const translatedAnswers = await lingoDotDev.batchLocalizeText(relevantText, {
      sourceLocale: "en",
      targetLocales: ['es', 'fr', 'de', 'zh'],
    });

    const answers = {
      'en': relevantText,
      'es': translatedAnswers[0],
      'fr': translatedAnswers[1],
      'de': translatedAnswers[2],
      'zh': translatedAnswers[3],
    };

    res.json({
      success: true,
      question: question,
      answers: answers
    });

  } catch (error) {
    console.error('Study helper error:', error.message);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;