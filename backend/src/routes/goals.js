const router = require('express').Router();
const { Goal } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try { res.json(await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try { res.status(201).json(await Goal.create({ ...req.body, userId: req.user.id })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try { res.json(await Goal.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try { await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id }); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
