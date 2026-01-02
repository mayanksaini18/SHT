const Habit = require('../models/Habit');
const User = require('../models/User');

const XP_PER_CHECKIN = 10;

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}
//helper function to get LOCAL date key
function getLocalDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`; // YYYY-MM-DD (LOCAL)
}


exports.createHabit = async (req, res, next) => {
  try {
    const { title, description, frequency } = req.body;
    const habit = await Habit.create({ user: req.user._id, title, description, frequency });
    res.json(habit);
  } catch (err) { next(err); }
};

exports.getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) { next(err); }
};

exports.weeklyAnalytics = async (req, res , next)=>{
  
  try {
    const userId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);

    const habits = await Habit.find({ user: userId, isActive: true });

    const dayMap = {};

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      dayMap[getLocalDateKey(d)] = 0;
    }

    habits.forEach(habit => {
      habit.checkins.forEach(checkin => {
        const d = new Date(checkin.date);
        d.setHours(0, 0, 0, 0);

        const key = getLocalDateKey(d);
        if (dayMap[key] !== undefined) {
          dayMap[key]++;
        }
      });
    });

    const result = Object.keys(dayMap).map(dateStr => {
      const d = new Date(dateStr);
      return {
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        count: dayMap[dateStr]
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Analytics failed' });
  }


}


exports.checkIn = async (req, res, next) => {
  try {
    const habitId = req.params.id;
    const habit = await Habit.findOne({ _id: habitId, user: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Not found' });

    const today = new Date();
    // prevent double check-in for same day
    if (habit.checkins.some(c => isSameDay(new Date(c.date), today))) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    // compute streak: if last checkin was yesterday -> +1 else reset to 1
    const lastCheckin = habit.checkins.length ? new Date(habit.checkins[habit.checkins.length - 1].date) : null;
    
    let newStreak = 1;
    if (lastCheckin) {
      const diff = Math.floor((today - lastCheckin) / (1000 * 60 * 60 * 24));
      if (diff === 1) newStreak = habit.streak + 1;
    }
    habit.streak = newStreak;
    habit.bestStreak = Math.max(habit.bestStreak, habit.streak);

    // add checkin record
    habit.checkins.push({ date: today, xpEarned: XP_PER_CHECKIN });
    await habit.save();

    // update user XP & level
    const user = await User.findById(req.user._id);
    user.xp += XP_PER_CHECKIN;
    // simple leveling: every 100 XP -> +1 level
    const newLevel = Math.floor(user.xp / 100) + 1;
    user.level = newLevel;
    await user.save();

    res.json({ habit, user: { xp: user.xp, level: user.level } });
  } catch (err) { next(err); }
};

