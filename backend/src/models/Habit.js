const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  xpEarned: { type: Number, default: 0 }
});

const habitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  frequency: { type: String, enum: ['daily','weekly','monthly'], default: 'daily' },
  createdAt: { type: Date, default: Date.now },
  checkins: [checkinSchema],
  streak: { type: Number, default: 0 },      // current consecutive days
  bestStreak: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Habit', habitSchema);
// habit schema
