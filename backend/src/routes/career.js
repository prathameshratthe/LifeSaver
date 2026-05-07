const router = require('express').Router();
const { JobApplication, Skill } = require('../models');
const auth = require('../middleware/auth');

// Job Applications
router.get('/applications', auth, async (req, res) => {
  try { res.json(await JobApplication.find({ userId: req.user.id }).sort({ appliedDate: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/applications', auth, async (req, res) => {
  try { res.status(201).json(await JobApplication.create({ ...req.body, userId: req.user.id })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/applications/:id', auth, async (req, res) => {
  try { res.json(await JobApplication.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/applications/:id', auth, async (req, res) => {
  try { await JobApplication.findOneAndDelete({ _id: req.params.id, userId: req.user.id }); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

// Skills
router.get('/skills', auth, async (req, res) => {
  try { res.json(await Skill.find({ userId: req.user.id })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/skills', auth, async (req, res) => {
  try { res.status(201).json(await Skill.create({ ...req.body, userId: req.user.id })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/skills/:id', auth, async (req, res) => {
  try { res.json(await Skill.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/skills/:id', auth, async (req, res) => {
  try { await Skill.findOneAndDelete({ _id: req.params.id, userId: req.user.id }); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
