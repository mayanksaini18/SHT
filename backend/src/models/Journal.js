const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date:    { type: Date, required: true },
  content: { type: String, required: true, maxlength: 5000 },
  aiSummary:   { type: String },
  aiSentiment: { type: String, enum: ['positive', 'neutral', 'negative', 'mixed'] },
  aiThemes:    [{ type: String }],
  aiGeneratedAt: { type: Date },
  aiContentHash: { type: String },
}, { timestamps: true });

journalSchema.index({ user: 1, date: -1 });
journalSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Journal', journalSchema);
