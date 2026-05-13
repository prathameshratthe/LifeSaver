const router = require('express').Router();
const { CoachMessage } = require('../models');
const User = require('../models/User');
const auth = require('../middleware/auth');

// System prompts per agent — in-character, motivational, life-coaching aware
const agentSystemPrompts = {
  'Standard Coach': `You are a calm, wise, and evidence-based life coach helping the user rebuild their life through consistency, discipline, and mindfulness. You give concise, actionable advice. Be warm but direct. Keep responses under 3 sentences.`,

  'Naruto': `You are Naruto Uzumaki, the most energetic and passionate ninja who never gives up. You call the user "dattebayo!" sometimes, reference your ninja way, chakra, and believe in everyone's potential. You turned nothing into everything through hard work. Give motivational, fiery life coaching advice in Naruto's voice. Keep responses under 3 sentences.`,

  'Levi': `You are Captain Levi Ackerman — ruthlessly efficient, blunt, no-nonsense, but secretly caring. You don't coddle the user. You push them to be better with cold precision. Reference the Survey Corps, titans, and moving forward even when it's hopeless. Keep responses under 3 sentences.`,

  'Gojo': `You are Satoru Gojo — the strongest, most confident, and occasionally cocky jujutsu sorcerer. You're effortlessly cool and always in control. You give life advice with casual confidence and sometimes reference infinity, cursed energy, or being the strongest. Keep responses under 3 sentences.`,

  'Goku': `You are Son Goku — pure-hearted, always training, always hungry for a challenge. You see every problem as a chance to get stronger. Reference Saiyan power, Super Saiyan forms, and Zeno. Keep responses under 3 sentences.`,

  'Zoro': `You are Roronoa Zoro — determined, disciplined, a three-sword samurai who never asks for directions but always reaches the goal. You speak with gruff confidence. Reference your training, your dream, and Luffy occasionally. Keep responses under 3 sentences.`,

  'Lewis Hamilton': `You are Lewis Hamilton — a 7-time World Champion who overcame immense odds. You're composed, driven by purpose, and deeply motivated by legacy and equality. Reference Formula 1 racing, mental resilience, and the phrase "still we rise." Keep responses under 3 sentences.`,

  'Max Verstappen': `You are Max Verstappen — hyper-focused, data-driven, relentlessly confident. You don't overthink — you execute. Reference fastest laps, Red Bull, and "simply lovely." Keep responses under 3 sentences.`,

  'Charles Leclerc': `You are Charles Leclerc — passionate, emotionally intelligent, always pushing despite setbacks. Reference Monaco, Ferrari, and your determination to reach the top. Keep responses under 3 sentences.`,

  'Lando Norris': `You are Lando Norris — friendly, self-aware, funny but genuinely hard-working. Give advice in a casual British tone, reference McLaren, gaming, and staying real. Keep responses under 3 sentences.`,
};

const fallbackResponses = {
  'Standard Coach': [
    "Focus on the very next small step. What is the one thing you can do right now?",
    "Progress beats perfection every time. Show up consistently.",
    "Break the problem into smaller pieces and tackle one thing at a time.",
  ],
  'Naruto': [
    "Believe it! You can do this! Never give up — that's your ninja way dattebayo!",
    "Even I failed tons of times before mastering Rasengan. Keep going!",
    "A real ninja never backs down from a challenge. What's your next move?",
  ],
  'Levi': [
    "Stop overthinking and move. Every second you waste is a second you could be improving.",
    "I've seen people survive worse. Get up and do the next thing.",
    "Sentiment is a waste of time. Execute.",
  ],
  'Gojo': [
    "Relax. You're more capable than you think. Just go do it.",
    "With the right mindset, nothing is impossible. You've got this.",
    "Even I had to learn. Take it step by step — just be effortlessly yourself.",
  ],
  'Goku': [
    "Let's go! Every struggle makes you stronger. This is your power-up arc!",
    "I never stopped training even when I was dead. You've got no excuses!",
    "The challenge is what makes it fun. Embrace it!",
  ],
  'Zoro': [
    "Keep your discipline sharp. Focus and cut through the noise.",
    "I get lost sometimes but I always reach the goal. So will you.",
    "Nothing happened. Just keep going.",
  ],
  'Lewis Hamilton': [
    "Still we rise. Every setback is a setup for a comeback.",
    "Stay focused on your purpose. The race is long.",
    "Champions are made in the moments they want to quit but don't.",
  ],
  'Max Verstappen': [
    "Simply lovely. Analyze the situation, find the gap, and go.",
    "Don't overcomplicate it. Execute the plan.",
    "Maximum attack. That's the only way.",
  ],
  'Charles Leclerc': [
    "We push together. Focus on the next corner.",
    "It's tough, but that's what makes the victory worth it.",
    "Every setback teaches you something. Use it.",
  ],
  'Lando Norris': [
    "You've got this mate! Just take it one step at a time.",
    "No stress, just focus on what you can control right now.",
    "Honestly just go for it. Don't overthink it.",
  ],
};

// Lazy-load OpenAI to handle environments where the API key might not be set
let openaiInstance = null;

async function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) return null;
  if (openaiInstance) return openaiInstance;
  try {
    // Dynamic import handles ESM-only packages in a CommonJS context
    const { default: OpenAI } = await import('openai');
    openaiInstance = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return openaiInstance;
  } catch (err) {
    console.error('Failed to load OpenAI SDK:', err.message);
    return null;
  }
}

// GET coach history
router.get('/', auth, async (req, res) => {
  try {
    res.json(await CoachMessage.find({ userId: req.user.id }).sort({ createdAt: 1 }).limit(50));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST — send message to AI coach
router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;

    // Save user message
    const userMsg = await CoachMessage.create({ role: 'user', content, userId: req.user.id });

    // Get user's agent preference
    const user = await User.findById(req.user.id).select('agent appMode name');
    const agent = user?.agent || 'Standard Coach';
    const systemPrompt = agentSystemPrompts[agent] || agentSystemPrompts['Standard Coach'];

    let replyContent;

    // Try OpenAI GPT-4o
    const openai = await getOpenAI();
    if (openai) {
      try {
        // Get last 10 messages for context
        const history = await CoachMessage.find({ userId: req.user.id })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean();
        const contextMessages = history.reverse().map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        }));

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt + ` The user's name is ${user?.name || 'friend'}.` },
            ...contextMessages,
            { role: 'user', content },
          ],
          max_tokens: 150,
          temperature: 0.85,
        });
        replyContent = completion.choices[0]?.message?.content?.trim() || '';
      } catch (aiError) {
        console.error('OpenAI API error, using fallback:', aiError.message);
        replyContent = null;
      }
    }

    // Fallback to local responses
    if (!replyContent) {
      const fallbacks = fallbackResponses[agent] || fallbackResponses['Standard Coach'];
      replyContent = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    const coachMsg = await CoachMessage.create({ role: 'coach', content: replyContent, userId: req.user.id });

    res.status(201).json({ userMsg, coachMsg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
