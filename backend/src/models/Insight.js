const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['weekly_report', 'correlation', 'tip'], required: true },
  content: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  weekOf: { type: Date },
  expiresAt: { type: Date, index: { expireAfterSeconds: 0 } }
}, { timestamps: true });

module.exports = mongoose.model('Insight', insightSchema);
