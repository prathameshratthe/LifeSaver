const router = require('express').Router();
const { Habit } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const habit = await Habit.create({ ...req.body, userId: req.user.id });
    res.status(201).json(habit);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
    res.json(habit);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/toggle', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!habit) return res.status(404).json({ message: 'Not found' });
    const { date } = req.body;
    const idx = habit.completedDates.indexOf(date);
    if (idx > -1) habit.completedDates.splice(idx, 1);
    else habit.completedDates.push(date);
    // Recalculate streak
    let streak = 0;
    const d = new Date();
    while (true) {
      const ds = d.toISOString().split('T')[0];
      if (habit.completedDates.includes(ds)) { streak++; d.setDate(d.getDate() - 1); } else break;
    }
    habit.currentStreak = streak;
    habit.bestStreak = Math.max(habit.bestStreak, streak);
    await habit.save();
    res.json(habit);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
