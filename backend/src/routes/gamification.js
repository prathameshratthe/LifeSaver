const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // Simple stats object matching the frontend interface
    const stats = {
      xp: user.xp || 0,
      level: user.level || 1,
      disciplineScore: user.disciplineScore || 50,
      badges: [],
      weeklyStreak: 0,
      totalFocusHours: 0,
      habitsCompleted: 0
    };
    res.json(stats);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/add-xp', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.id);
    user.xp += amount;
    
    // Level up logic (every 200 XP = 1 Level)
    const newLevel = Math.floor(user.xp / 200) + 1;
    let leveledUp = false;
    if (newLevel > user.level) {
      user.level = newLevel;
      leveledUp = true;
    }
    await user.save();
    
    res.json({ xp: user.xp, level: user.level, leveledUp });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
