const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  updateGoals, updateReminders,
  subscribePush, unsubscribePush, getVapidPublicKey
} = require('../controllers/settingsController');

router.get('/vapid-public-key', getVapidPublicKey);

router.use(auth);

router.put('/goals', [
  body('sleep').optional().isFloat({ min: 1, max: 24 }),
  body('exercise').optional().isInt({ min: 0, max: 7 }),
  body('mood').optional().isFloat({ min: 1, max: 5 }),
  body('water').optional().isInt({ min: 1, max: 50 }),
], validate, updateGoals);

router.put('/reminders', [
  body('mood').optional().isString(),
  body('sleep').optional().isString(),
  body('water').optional().isString(),
  body('exercise').optional().isString(),
], validate, updateReminders);

router.post('/push-subscribe', subscribePush);
router.delete('/push-unsubscribe', unsubscribePush);

module.exports = router;
