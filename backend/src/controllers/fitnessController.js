const Fitness = require('../models/Fitness');

function getUTCStartOfDay(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

exports.logExercise = async (req, res, next) => {
  try {
    const { exercises, date } = req.body;
    const targetDate = date ? getUTCStartOfDay(new Date(date)) : getUTCStartOfDay(new Date());

    const totalDuration = exercises.reduce((s, e) => s + (e.duration || 0), 0);
    const totalCalories = exercises.reduce((s, e) => s + (e.calories || 0), 0);

    const fitness = await Fitness.findOneAndUpdate(
      { user: req.user._id, date: targetDate },
      { exercises, totalDuration, totalCalories },
      { upsert: true, new: true, runValidators: true }
    );
    res.status(201).json(fitness);
  } catch (err) { next(err); }
};

exports.getFitnessHistory = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 30, 100);
    const entries = await Fitness.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(limit);
    res.json(entries);
  } catch (err) { next(err); }
};

exports.getFitnessStats = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);

    const entries = await Fitness.find({
      user: req.user._id,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    const weeklyDuration = entries.reduce((s, e) => s + e.totalDuration, 0);
    const weeklyCalories = entries.reduce((s, e) => s + e.totalCalories, 0);
    const totalExercises = entries.reduce((s, e) => s + e.exercises.length, 0);

    res.json({ weeklyDuration, weeklyCalories, totalExercises, activeDays: entries.length });
  } catch (err) { next(err); }
};
