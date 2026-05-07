const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['health', 'fitness', 'career', 'learning', 'finance', 'spiritual', 'relationships'], default: 'health' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
  completedDates: [String],
  currentStreak: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
  color: { type: String, default: '#0cce6b' },
  icon: { type: String, default: '🎯' },
}, { timestamps: true });

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  category: String,
  targetDate: String,
  progress: { type: Number, default: 0 },
  milestones: [{
    title: String,
    completed: { type: Boolean, default: false },
    completedDate: String,
  }],
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
}, { timestamps: true });

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: String,
  date: { type: String, required: true },
}, { timestamps: true });

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: String,
  limit: Number,
  spent: { type: Number, default: 0 },
  month: String,
}, { timestamps: true });

const savingsGoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  target: Number,
  current: { type: Number, default: 0 },
  deadline: String,
  icon: String,
}, { timestamps: true });

const journalEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  mood: Number,
  energy: Number,
  stress: Number,
  motivation: Number,
  gratitude: [String],
  date: String,
  tags: [String],
}, { timestamps: true });

const healthLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: String,
  sleepHours: Number,
  waterIntake: Number,
  exercise: Number,
  steps: Number,
  weight: Number,
  energyLevel: Number,
}, { timestamps: true });

const focusSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: Number,
  type: { type: String, enum: ['pomodoro', 'deep-work', 'custom'], default: 'pomodoro' },
  startTime: String,
  endTime: String,
  completed: { type: Boolean, default: false },
  category: String,
}, { timestamps: true });

const jobApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: String,
  position: String,
  status: { type: String, enum: ['applied', 'screening', 'interview', 'offer', 'rejected'], default: 'applied' },
  appliedDate: String,
  notes: String,
}, { timestamps: true });

const skillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  level: { type: Number, default: 0 },
  targetLevel: { type: Number, default: 100 },
  category: String,
}, { timestamps: true });

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['habit', 'sleep', 'water', 'focus', 'reflection', 'achievement', 'system'], default: 'system' },
  title: String,
  message: String,
  read: { type: Boolean, default: false },
}, { timestamps: true });

const coachMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['user', 'coach'], required: true },
  content: String,
}, { timestamps: true });

module.exports = {
  Habit: mongoose.model('Habit', habitSchema),
  Goal: mongoose.model('Goal', goalSchema),
  Transaction: mongoose.model('Transaction', transactionSchema),
  Budget: mongoose.model('Budget', budgetSchema),
  SavingsGoal: mongoose.model('SavingsGoal', savingsGoalSchema),
  JournalEntry: mongoose.model('JournalEntry', journalEntrySchema),
  HealthLog: mongoose.model('HealthLog', healthLogSchema),
  FocusSession: mongoose.model('FocusSession', focusSessionSchema),
  JobApplication: mongoose.model('JobApplication', jobApplicationSchema),
  Skill: mongoose.model('Skill', skillSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  CoachMessage: mongoose.model('CoachMessage', coachMessageSchema),
};
