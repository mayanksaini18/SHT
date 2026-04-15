const Mood = require('../models/Mood');
const Sleep = require('../models/Sleep');
const Water = require('../models/Water');
const Fitness = require('../models/Fitness');

// Returns suggested HH:MM (UTC) reminder times for each module based on the
// user's own logging patterns over the last 30 days. The heuristic: pick a
// time ~30 minutes before the user's typical logging time — gentle nudge.

function minutesToHHMM(minutes) {
  const m = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const mm = Math.floor(m % 60);
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function medianMinuteOfDay(dates) {
  if (!dates.length) return null;
  const minutes = dates.map((d) => {
    const dt = new Date(d);
    return dt.getUTCHours() * 60 + dt.getUTCMinutes();
  }).sort((a, b) => a - b);
  const mid = Math.floor(minutes.length / 2);
  return minutes.length % 2 ? minutes[mid] : Math.round((minutes[mid - 1] + minutes[mid]) / 2);
}

const DEFAULTS = { mood: '20:00', sleep: '22:30', water: '10:00', exercise: '17:00' };

exports.getSuggestions = async (req, res, next) => {
  try {
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 30);

    const userId = req.user._id;
    const [moods, sleeps, waters, fitness] = await Promise.all([
      Mood.find({ user: userId, createdAt: { $gte: since } }).select('createdAt').lean(),
      Sleep.find({ user: userId, createdAt: { $gte: since } }).select('createdAt').lean(),
      Water.find({ user: userId, createdAt: { $gte: since } }).select('createdAt').lean(),
      Fitness.find({ user: userId, createdAt: { $gte: since } }).select('createdAt').lean(),
    ]);

    const suggestions = {};
    const samples = {};

    for (const [mod, rows] of Object.entries({ mood: moods, sleep: sleeps, water: waters, exercise: fitness })) {
      samples[mod] = rows.length;
      if (rows.length < 3) {
        suggestions[mod] = { time: DEFAULTS[mod], reason: 'default (not enough data yet)' };
        continue;
      }
      const median = medianMinuteOfDay(rows.map((r) => r.createdAt));
      const nudge = median - 30;
      suggestions[mod] = {
        time: minutesToHHMM(nudge),
        reason: `you usually log ${mod} around ${minutesToHHMM(median)}`,
      };
    }

    res.json({ suggestions, samples });
  } catch (err) { next(err); }
};
