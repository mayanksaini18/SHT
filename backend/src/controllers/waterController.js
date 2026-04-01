const Water = require('../models/Water');

function getUTCStartOfDay(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

exports.logWater = async (req, res, next) => {
  try {
    const { glasses, goal } = req.body;
    const today = getUTCStartOfDay(new Date());

    const water = await Water.findOneAndUpdate(
      { user: req.user._id, date: today },
      { $inc: { glasses: glasses || 1 }, ...(goal ? { goal } : {}) },
      { upsert: true, new: true, runValidators: true }
    );
    res.status(201).json(water);
  } catch (err) { next(err); }
};

exports.getWaterToday = async (req, res, next) => {
  try {
    const today = getUTCStartOfDay(new Date());
    const water = await Water.findOne({ user: req.user._id, date: today });
    res.json(water || { glasses: 0, goal: 8, date: today });
  } catch (err) { next(err); }
};

exports.getWaterHistory = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 30, 100);
    const entries = await Water.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(limit);
    res.json(entries);
  } catch (err) { next(err); }
};

exports.setWaterGoal = async (req, res, next) => {
  try {
    const { goal } = req.body;
    const today = getUTCStartOfDay(new Date());
    const water = await Water.findOneAndUpdate(
      { user: req.user._id, date: today },
      { goal },
      { upsert: true, new: true, runValidators: true }
    );
    res.json(water);
  } catch (err) { next(err); }
};
