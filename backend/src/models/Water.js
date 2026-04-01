const mongoose = require('mongoose');

const waterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true },
  glasses: { type: Number, default: 0, min: 0 },
  goal: { type: Number, default: 8, min: 1 },
}, { timestamps: true });

waterSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Water', waterSchema);
