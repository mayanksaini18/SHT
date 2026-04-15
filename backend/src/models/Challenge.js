const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  key:         { type: String, required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  module:      { type: String, enum: ['mood', 'sleep', 'water', 'exercise', 'habits', 'journal'], required: true },
  target:      { type: Number, required: true },
  progress:    { type: Number, default: 0 },
  xpReward:    { type: Number, default: 50 },
  weekStart:   { type: Date, required: true },
  completed:   { type: Boolean, default: false },
  completedAt: { type: Date },
}, { timestamps: true });

challengeSchema.index({ user: 1, weekStart: 1 });
challengeSchema.index({ user: 1, weekStart: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('Challenge', challengeSchema);
