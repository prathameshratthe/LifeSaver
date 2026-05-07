const router = require('express').Router();
const { FocusSession } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try { res.json(await FocusSession.find({ userId: req.user.id }).sort({ startTime: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try { res.status(201).json(await FocusSession.create({ ...req.body, userId: req.user.id })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try { await FocusSession.findOneAndDelete({ _id: req.params.id, userId: req.user.id }); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
