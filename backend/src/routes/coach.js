const router = require('express').Router();
const { CoachMessage } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try { res.json(await CoachMessage.find({ userId: req.user.id }).sort({ createdAt: 1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;
    // Save user message
    const userMsg = await CoachMessage.create({ role: 'user', content, userId: req.user.id });
    
    // Simulate AI response (In production, integrate with OpenAI/Gemini)
    setTimeout(async () => {
      const responses = [
        "That's a great observation. Focus on small steps today.",
        "Your consistency is key. Keep up the good work!",
        "Don't be too hard on yourself. Rest is also productive.",
        "Based on your trends, you are doing well this week."
      ];
      const reply = responses[Math.floor(Math.random() * responses.length)];
      await CoachMessage.create({ role: 'coach', content: reply, userId: req.user.id });
    }, 1000);
    
    res.status(201).json(userMsg);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
