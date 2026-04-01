const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true },
  score: { type: Number, required: true, min: 1, max: 5 },
  notes: { type: String, maxlength: 1000 },
  tags: [{
    type: String,
    enum: ['happy', 'sad', 'anxious', 'calm', 'energetic', 'tired', 'stressed', 'grateful', 'focused', 'angry']
  }]
}, { timestamps: true });

moodSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Mood', moodSchema);
