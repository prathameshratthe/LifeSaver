const router = require('express').Router();
const auth = require('../middleware/auth');
const { Habit, FocusSession, MoodEntry, User } = require('../models');

router.get('/summary', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const habitsCount = await Habit.countDocuments({ userId: req.user.id });
    const focusTotal = await FocusSession.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: null, totalDuration: { $sum: '$duration' } } }
    ]);
    const duration = focusTotal.length > 0 ? focusTotal[0].totalDuration : 0;

    res.json({
      level: user.level,
      xp: user.xp,
      disciplineScore: user.disciplineScore,
      habitsCount,
      totalFocusMinutes: duration,
      lifeScore: { health: 75, finance: 60, career: 80, relationships: 70, spiritual: 65, learning: 85 } // Placeholder calculation
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
