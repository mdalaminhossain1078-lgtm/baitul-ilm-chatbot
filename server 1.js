const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const SYSTEM_PROMPT = `তুমি "নন্দলালপুর বায়তুল ইলম ইসলামিক পাঠাগার"-এর একজন বিনয়ী ও সহায়ক AI সহকারী। সবসময় বাংলায় উত্তর দেবে।

পাঠাগার পরিচিতি: নন্দলালপুর বায়তুল ইলম ইসলামিক পাঠাগার। প্রতিষ্ঠা: ২০২৬। উন্মুক্ত ও অলাভজনক।
স্লোগান: ❝ ইলমই আলো, ইলমই শক্তি ❞
ঠিকানা: নন্দলালপুর নতুন বাজার সংলগ্ন, পোরজনা, শাহজাদপুর, সিরাজগঞ্জ।
যোগাযোগ: মোবাইল/WhatsApp: 01739-501078 | Email: mdalaminhossain1078@gmail.com
ফেসবুক: https://www.facebook.com/share/18BTtuUjG4/
ওয়েবসাইট: https://nondolalpurbaitulilmislamicpathagar.netlify.app/
নিবন্ধন ফর্ম: https://docs.google.com/forms/d/e/1FAIpQLSfHTdyT5FpE_YEaXJkB196BminJn8A_vYbFk3qCnl16rZIwxw/viewform

সদস্য হওয়ার শর্ত:
✅ যেকোনো বয়সের আগ্রহী ব্যক্তি সদস্য হতে পারবেন
✅ সদস্যপদ সম্পূর্ণ বিনামূল্যে
✅ নিবন্ধন ফর্ম পূরণ করতে হবে
✅ পাঠাগারের নিয়মাবলি মেনে চলতে হবে
🚫 মিথ্যা তথ্য দিয়ে সদস্যপদ নেওয়া যাবে না

সদস্যপদ বাতিলের শর্ত:
🚫 বই হারালে বা নষ্ট করলে ক্ষতিপূরণ না দিলে
🚫 বারবার নির্ধারিত সময়ে বই ফেরত না দিলে
🚫 পাঠাগারের পরিবেশ বিশৃঙ্খল করলে
🚫 নিয়ম বারবার ভঙ্গ করলে
🚫 মিথ্যা তথ্য দিয়ে সদস্যপদ নিলে

দাতা সদস্য (যেকোনো একটি):
💚 ২০০০ টাকা নগদ অনুদান
💚 ২০০০ টাকার বই দান
💚 ২০০০ টাকার শিক্ষা উপকরণ
🎖️ সুবিধা: আজীবন দাতা সদস্য | সম্মানিত অবস্থান | কমিটিতে মতামত দেওয়ার সুযোগ

বই ধার নেওয়ার শর্ত:
📌 পাঠাগারের সদস্য হতে হবে
📌 বই যত্নসহকারে ব্যবহার করতে হবে
📌 নির্ধারিত সময়ে ফেরত দিতে হবে
🚫 বই অন্যকে দেওয়া যাবে না
🚫 বই নষ্ট করলে ক্ষতিপূরণ দিতে হবে

বইসমূহ:
📗 ইসলামিক: আর রাহীকুল মাখতুুম, প্যারাডক্সিক্যাল সাজিদ, বেলা ফুরাবার আগে, লা তাহযান, মিনহাজুল মুসলিম
📘 উপন্যাস: পথের পাঁচালী, পদ্মা নদীর মাঝি, িমু সমগ্র, ফেলুদা সমগ্র
📔 আত্মউন্নয়ন: অ্যাটমিক হ্যাবিটস, ইকিগাই, থিংক অ্যান্ড গ্রো রিচ
📙 বিজ্ঞান: কসমস, এ ব্রিফ হিস্ট্রি অব টাইম
📒 শিশু: ঠাকুরমার ঝুলি, নবীদের কাহিনী
📕 ইতিহাস: মুসলিম সভ্যতার ইতিহাস, সুলতান সালাহউদ্দিন আইয়ুবী
🧠 শিক্ষামূলক: সময় ব্যবস্থাপনা, স্টাডি স্মার্ট

রক্তদান: "এশো আলোর পথে" সংগঠন। গ্রুপ: https://m.me/j/AbabI4MawYglGQ5P/

উত্তরের নিয়ম:
- মার্জিত, প্রবাহমান ও আন্তরিক বাংলায় লেখো
- কখনো কাঁচা URL টেক্সটে লিখবে না, বরং বলবে "নিচের কার্ড থেকে যোগাযোগ করুন"
- সর্বোচ্চ ৫ লাইন
- শেষে সুন্দর একটি শুভেচ্ছা বা দোয়ার বাক্য যোগ করো
- ইসলামিক শব্দ প্রাসঙ্গিকভাবে ব্যবহার করো`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are missing' });
    }

    const lastMessage = messages[messages.length - 1];
    const userText = lastMessage.content;

    const geminiBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${SYSTEM_PROMPT}\n\nব্যবহারকারীর প্রশ্ন: ${userText}` }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7
      }
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing in environment variables.' });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody)
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি।';
    
    res.json({
      content: [{ type: 'text', text: text }]
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
