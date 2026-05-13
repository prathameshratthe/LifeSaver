require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://life-saver-beta.vercel.app',
  'https://frontend-eight-sand-66.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lifebackontrack');
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.log('⚠️  MongoDB not available, running with in-memory data');
  }
};

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/finance', require('./routes/finance'));
app.use('/api/journal', require('./routes/journal'));
app.use('/api/health', require('./routes/health'));
app.use('/api/focus', require('./routes/focus'));
app.use('/api/career', require('./routes/career'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/coach', require('./routes/coach'));
app.use('/api/notifications', require('./routes/notifications'));

// Health check
app.get('/api/health-check', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
  });
});
