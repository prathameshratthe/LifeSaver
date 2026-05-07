const router = require('express').Router();
const { Transaction, Budget, SavingsGoal } = require('../models');
const auth = require('../middleware/auth');

// Transactions
router.get('/transactions', auth, async (req, res) => {
  try { res.json(await Transaction.find({ userId: req.user.id }).sort({ date: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/transactions', auth, async (req, res) => {
  try { res.status(201).json(await Transaction.create({ ...req.body, userId: req.user.id })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

// Budgets
router.get('/budgets', auth, async (req, res) => {
  try { res.json(await Budget.find({ userId: req.user.id })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/budgets', auth, async (req, res) => {
  try { res.status(201).json(await Budget.create({ ...req.body, userId: req.user.id })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

// Savings
router.get('/savings', auth, async (req, res) => {
  try { res.json(await SavingsGoal.find({ userId: req.user.id })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/savings', auth, async (req, res) => {
  try { res.status(201).json(await SavingsGoal.create({ ...req.body, userId: req.user.id })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
