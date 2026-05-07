const router = require('express').Router();
const { Notification } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try { res.json(await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/read', auth, async (req, res) => {
  try { res.json(await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { read: true }, { new: true })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
