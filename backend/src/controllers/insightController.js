const Insight = require('../models/Insight');
const Habit = require('../models/Habit');
const Mood = require('../models/Mood');
const Sleep = require('../models/Sleep');
const Water = require('../models/Water');
const Fitness = require('../models/Fitness');

async function gatherWeeklyData(userId) {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setUTCDate(now.getUTCDate() - 7);

  const [habits, moods, sleeps, waters, fitness] = await Promise.all([
    Habit.find({ user: userId, isActive: true }),
    Mood.find({ user: userId, date: { $gte: weekAgo } }).sort({ date: 1 }),
    Sleep.find({ user: userId, date: { $gte: weekAgo } }).sort({ date: 1 }),
    Water.find({ user: userId, date: { $gte: weekAgo } }).sort({ date: 1 }),
    Fitness.find({ user: userId, date: { $gte: weekAgo } }).sort({ date: 1 }),
  ]);

  const habitCompletions = habits.map(h => {
    const weekCheckins = h.checkins.filter(c => new Date(c.date) >= weekAgo).length;
    return { title: h.title, category: h.category, checkins: weekCheckins, streak: h.streak };
  });

  return {
    habits: habitCompletions,
    moods: moods.map(m => ({ date: m.date.toISOString().slice(0, 10), score: m.score, tags: m.tags })),
    sleep: sleeps.map(s => ({ date: s.date.toISOString().slice(0, 10), duration: s.duration, quality: s.quality })),
    water: waters.map(w => ({ date: w.date.toISOString().slice(0, 10), glasses: w.glasses, goal: w.goal })),
    fitness: fitness.map(f => ({ date: f.date.toISOString().slice(0, 10), duration: f.totalDuration, calories: f.totalCalories })),
  };
}

exports.getWeeklyReport = async (req, res, next) => {
  try {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setUTCDate(now.getUTCDate() - 7);

    // Check cache first
    const cached = await Insight.findOne({
      user: req.user._id,
      type: 'weekly_report',
      weekOf: { $gte: weekStart }
    });

    if (cached) return res.json(cached);

    const weeklyData = await gatherWeeklyData(req.user._id);

    // If Anthropic SDK is available, generate AI report
    let content;
    try {
      const Anthropic = require('@anthropic-ai/sdk');
      const client = new Anthropic();

      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `You are a wellness coach. Analyze this user's weekly data and provide a brief, encouraging wellness report with 3-4 key insights and 2 actionable suggestions. Be specific about correlations you notice. Keep it under 300 words.

Weekly Data:
${JSON.stringify(weeklyData, null, 2)}`
        }]
      });
      content = message.content[0].text;
    } catch {
      // Fallback if no API key or SDK
      const { habits, moods, sleep, water, fitness } = weeklyData;
      const avgMood = moods.length ? (moods.reduce((s, m) => s + m.score, 0) / moods.length).toFixed(1) : 'N/A';
      const avgSleep = sleep.length ? (sleep.reduce((s, e) => s + (e.duration || 0), 0) / sleep.length).toFixed(1) : 'N/A';
      const totalCheckins = habits.reduce((s, h) => s + h.checkins, 0);
      const waterAvg = water.length ? Math.round(water.reduce((s, w) => s + w.glasses, 0) / water.length) : 0;
      const fitnessDays = fitness.length;

      content = `## Weekly Wellness Summary\n\n` +
        `**Habits:** ${totalCheckins} check-ins across ${habits.length} habits this week.\n` +
        `**Mood:** Average score ${avgMood}/5 over ${moods.length} entries.\n` +
        `**Sleep:** Averaging ${avgSleep} hours per night.\n` +
        `**Water:** Averaging ${waterAvg} glasses per day.\n` +
        `**Fitness:** Active on ${fitnessDays} days this week.\n\n` +
        `Keep up the consistency! Focus on maintaining your streaks and staying hydrated.`;
    }

    const insight = await Insight.create({
      user: req.user._id,
      type: 'weekly_report',
      content,
      data: weeklyData,
      weekOf: weekStart,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    res.json(insight);
  } catch (err) { next(err); }
};

exports.getInsights = async (req, res, next) => {
  try {
    const insights = await Insight.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(insights);
  } catch (err) { next(err); }
};
