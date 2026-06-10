const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());
app.use(express.static('.'));

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, system } = req.body;

    const body = {
      model: 'qwen/qwen-2.5-7b-instruct',
      max_tokens: 1000,
      messages: [
        { role: 'system', content: system },
        ...messages
      ]
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log('OpenRouter response:', JSON.stringify(data).substring(0, 200));
    const text = data.choices?.[0]?.message?.content || 'দুঃখিত, উত্তর পাওয়া যায়নি।';
    res.json({ content: [{ type: 'text', text: text }] });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
