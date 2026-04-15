const cron = require('node-cron');
const webpush = require('web-push');
const User = require('./models/User');
const Mood = require('./models/Mood');
const Sleep = require('./models/Sleep');
const Water = require('./models/Water');
const Fitness = require('./models/Fitness');

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@smarthabittracker.online',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

function getUTCStartOfDay(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

async function sendPush(subscription, payload) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (err) {
    // Subscription expired or invalid — will be cleaned up
    if (err.statusCode === 410 || err.statusCode === 404) return 'expired';
  }
}

async function processReminders() {
  if (!process.env.VAPID_PUBLIC_KEY) return;

  const now = new Date();
  const currentHHMM = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;
  const todayStart = getUTCStartOfDay(now);

  // Find users who have push subscriptions and at least one reminder matching this minute
  const users = await User.find({ 'pushSubscriptions.0': { $exists: true } });

  for (const user of users) {
    const rt = user.reminderTimes || {};
    const modules = ['mood', 'sleep', 'water', 'exercise'];
    const expiredEndpoints = [];

    for (const mod of modules) {
      if (!rt[mod] || rt[mod] !== currentHHMM) continue;

      // Check if already logged today
      let alreadyLogged = false;
      if (mod === 'mood')     alreadyLogged = !!(await Mood.findOne({ user: user._id, date: { $gte: todayStart } }));
      if (mod === 'sleep')    alreadyLogged = !!(await Sleep.findOne({ user: user._id, date: { $gte: todayStart } }));
      if (mod === 'water')    alreadyLogged = !!(await Water.findOne({ user: user._id, date: { $gte: todayStart } }));
      if (mod === 'exercise') alreadyLogged = !!(await Fitness.findOne({ user: user._id, date: { $gte: todayStart } }));

      if (alreadyLogged) continue;

      const messages = {
        mood:     { title: 'How are you feeling?',        body: "Log today's mood — it only takes a second.",  url: '/mood' },
        sleep:    { title: 'How did you sleep?',           body: 'Track last night\'s rest.',                   url: '/sleep' },
        water:    { title: 'Stay hydrated!',               body: "Don't forget to log your water intake.",      url: '/water' },
        exercise: { title: 'Time to move!',                body: 'Log your workout for today.',                  url: '/fitness' },
      };

      for (const sub of user.pushSubscriptions) {
        const result = await sendPush(sub, messages[mod]);
        if (result === 'expired') expiredEndpoints.push(sub.endpoint);
      }
    }

    // Clean up expired subscriptions
    if (expiredEndpoints.length > 0) {
      await User.findByIdAndUpdate(user._id, {
        $pull: { pushSubscriptions: { endpoint: { $in: expiredEndpoints } } }
      });
    }
  }
}

function startScheduler() {
  // Run every minute
  cron.schedule('* * * * *', () => {
    processReminders().catch(console.error);
  });
  console.log('Reminder scheduler started.');
}

module.exports = { startScheduler };
