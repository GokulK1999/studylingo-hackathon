const express = require('express');
const cors = require('cors');
const { LingoDotDevEngine } = require('lingo.dev/sdk');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

app.get('/', (req, res) => {
  res.json({ message: 'StudyLingo API is running!' });
});

app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguages } = req.body;
    
    console.log('Translation request received');
    
    if (!process.env.LINGODOTDEV_API_KEY) {
      throw new Error('API key not configured');
    }

    // call the lingo translation api
    const translatedTexts = await lingoDotDev.batchLocalizeText(text, {
      sourceLocale: "en",
      targetLocales: targetLanguages,
    });
    
    console.log('Translation complete');
    
    // map the results to language codes
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

// Study helper endpoint - extracts key concepts
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

    // extract a relevant snippet based on the question
    let relevantText = context;
    
    // if question contains specific words, try to find relevant sentences
    if (question) {
      const questionWords = question.toLowerCase().split(' ');
      const sentences = context.split(/[.!?]+/);
      
      // find sentences that match question keywords
      const matchingSentences = sentences.filter(sentence => {
        const lowerSentence = sentence.toLowerCase();
        return questionWords.some(word => 
          word.length > 3 && lowerSentence.includes(word)
        );
      });

      if (matchingSentences.length > 0) {
        relevantText = matchingSentences.slice(0, 2).join('. ').trim();
      } else {
        // just use first few sentences
        relevantText = sentences.slice(0, 2).join('. ').trim();
      }
    }

    // limit length
    if (relevantText.length > 300) {
      relevantText = relevantText.substring(0, 300) + '...';
    }

    // translate the relevant excerpt
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
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});