# 📚 StudyLingo

AI-powered multilingual study assistant that helps students learn through multiple language perspectives.

## 🎯 The Problem

Students often struggle with complex educational content. Language barriers and unfamiliar terminology make learning harder. Traditional translation tools don't help students understand concepts - they just translate words.

## 💡 The Solution

StudyLingo transforms how students learn by:
- Providing instant translations in 5 languages
- Visualizing word patterns and text complexity
- Letting students search for specific topics across languages
- Showing how different cultures explain the same concepts

## ✨ Key Features

### Instant Multilingual Translation
Translate study materials into Spanish, French, German, Chinese, and Arabic with one click.

### Interactive Data Visualizations
- Word Frequency Chart - Identify key terms at a glance
- Language Comparison - See how translation lengths vary
- Complexity Meter - Understand text difficulty level

### Study Helper
Ask about specific topics and get relevant excerpts in all 5 languages. Perfect for finding key concepts quickly, learning terminology across languages, and understanding how different languages explain concepts.

### Dark Mode
Easy on the eyes for late-night study sessions.

## 🛠️ Tech Stack

**Frontend**
- React.js - Component-based UI
- D3.js - Data visualizations
- CSS3 - Animations and theming

**Backend**
- Node.js + Express - REST API
- Lingo.dev SDK - AI-powered translations
- Clean architecture with error handling

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Lingo.dev API key (sign up at https://lingo.dev)

### Installation

Clone the repository:
```bash
git clone https://github.com/GokulK1999/studylingo-hackathon.git
cd studylingo-hackathon
```

Install backend dependencies:
```bash
cd server
npm install
```

Install frontend dependencies:
```bash
cd ../client
npm install
```

Set up environment variables by creating `server/.env`:
```env
PORT=5001
LINGODOTDEV_API_KEY=your_api_key_here
```

Start the backend:
```bash
cd server
npm start
```

Start the frontend in a new terminal:
```bash
cd client
npm start
```

Open your browser and navigate to http://localhost:3000

## 📖 How to Use

1. Paste your study material in the text area
2. Click Translate to see it in 5 languages
3. Check the visualizations to understand word patterns
4. Use Study Helper to search for specific topics
5. Toggle dark mode for comfortable reading
6. Copy translations for notes or flashcards

## 🎓 Real-World Use Cases

- International students studying in a second language
- Language learners mastering technical subjects
- Researchers reading academic papers in foreign languages
- Students wanting multiple perspectives on complex topics
- Teachers creating multilingual study materials

## 🌟 What Makes This Special

Unlike basic translation tools, StudyLingo focuses on learning, provides visual analytics for better comprehension, lets you search and explore content interactively, and works specifically with educational content.

## 🎯 Built With Lingo.dev

This project showcases Lingo.dev's powerful translation API through efficient batch translations, seamless support for 5+ languages, context-aware translations, and the interactive Study Helper search feature.

## 🏆 Hackathon Details

Event: WeMakeDevs x Lingo Multilingual Hackathon  
Date: November 2024  
Category: Educational Tools

## 👨‍💻 Author

Gokul Kalla  
GitHub: https://github.com/GokulK1999

Built with care for students worldwide 🌍

## 📄 License

MIT License