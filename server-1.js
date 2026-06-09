const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, system } = req.body;
    const lastMessage = messages[messages.length - 1];
    const userText = lastMessage.content;

    const geminiBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${system}\n\nপ্রশ্ন: ${userText}` }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7
      }
    };

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody)
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'দুঃখিত, উত্তর পাওয়া যায়নি।';
    res.json({ content: [{ type: 'text', text: text }] });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
