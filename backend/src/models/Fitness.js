const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  type: { type: String, enum: ['cardio', 'strength', 'flexibility', 'sport', 'other'], default: 'other' },
  duration: { type: Number, min: 0 },
  calories: { type: Number, min: 0 },
  sets: { type: Number, min: 0 },
  reps: { type: Number, min: 0 }
});

const fitnessSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true },
  exercises: [exerciseSchema],
  totalDuration: { type: Number, default: 0 },
  totalCalories: { type: Number, default: 0 }
}, { timestamps: true });

fitnessSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Fitness', fitnessSchema);
