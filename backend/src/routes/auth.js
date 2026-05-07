const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user);
    res.status(201).json({ user: { _id: user._id, name: user.name, email: user.email, onboarded: false }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ user: { _id: user._id, name: user.name, email: user.email, onboarded: user.onboarded }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Onboard
router.post('/onboard', auth, async (req, res) => {
  try {
    const { 
      age, stressLevel, sleepSchedule, 
      selectedStruggles, careerGoals, financialGoals, healthGoals, 
      selectedHabits, selectedOutOfControl,
      appMode, agent
    } = req.body;

    const user = await User.findById(req.user.id);
    user.age = age;
    user.appMode = appMode || 'default';
    user.agent = agent || 'Default Coach';
    user.onboardingData = { age, stressLevel, sleepSchedule, selectedStruggles, careerGoals, financialGoals, healthGoals, selectedHabits, selectedOutOfControl };
    user.onboarded = true;
    await user.save();
    
    res.json({ user: { _id: user._id, name: user.name, email: user.email, onboarded: user.onboarded, appMode: user.appMode, agent: user.agent } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
