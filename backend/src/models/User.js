const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: String,
  age: Number,
  onboarded: { type: Boolean, default: false },
  onboardingData: {
    struggles: [String],
    careerGoals: String,
    financialGoals: String,
    healthGoals: String,
    sleepSchedule: String,
    stressLevel: Number,
    currentHabits: [String],
    outOfControl: [String],
  },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  disciplineScore: { type: Number, default: 50 },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
