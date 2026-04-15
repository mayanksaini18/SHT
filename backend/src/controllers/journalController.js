const Journal = require('../models/Journal');

function getUTCStartOfDay(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

// POST /api/journal  — upsert today's entry
exports.saveEntry = async (req, res, next) => {
  try {
    const { content, date } = req.body;
    const day = date ? getUTCStartOfDay(new Date(date)) : getUTCStartOfDay(new Date());

    const entry = await Journal.findOneAndUpdate(
      { user: req.user._id, date: day },
      { content },
      { upsert: true, new: true, runValidators: true }
    );
    res.status(201).json(entry);
  } catch (err) { next(err); }
};

// GET /api/journal  — list entries (newest first)
exports.getEntries = async (req, res, next) => {
  try {
    const { limit = 30, offset = 0 } = req.query;
    const entries = await Journal.find({ user: req.user._id })
      .sort({ date: -1 })
      .skip(Number(offset))
      .limit(Math.min(Number(limit), 100));
    res.json(entries);
  } catch (err) { next(err); }
};

// GET /api/journal/:date  — single entry by date (YYYY-MM-DD)
exports.getEntryByDate = async (req, res, next) => {
  try {
    const day = getUTCStartOfDay(new Date(req.params.date));
    const entry = await Journal.findOne({ user: req.user._id, date: day });
    if (!entry) return res.status(404).json({ message: 'No entry for this date' });
    res.json(entry);
  } catch (err) { next(err); }
};

// DELETE /api/journal/:id
exports.deleteEntry = async (req, res, next) => {
  try {
    const entry = await Journal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (err) { next(err); }
};
