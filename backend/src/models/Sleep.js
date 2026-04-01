const mongoose = require('mongoose');

const sleepSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true },
  bedtime: { type: String },
  wakeTime: { type: String },
  duration: { type: Number, min: 0, max: 24 },
  quality: { type: Number, min: 1, max: 5 },
  notes: { type: String, maxlength: 500 }
}, { timestamps: true });

sleepSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Sleep', sleepSchema);
