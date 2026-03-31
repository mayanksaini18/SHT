const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createHabit, getHabits, checkIn, weeklyAnalytics, updateHabit, deleteHabit
} = require('../controllers/habitController');

const habitValidation = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title must be under 100 characters'),
  body('description').optional().trim()
    .isLength({ max: 500 }).withMessage('Description must be under 500 characters'),
  body('frequency').optional().isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Frequency must be daily, weekly, or monthly'),
];

const mongoIdParam = [
  param('id').isMongoId().withMessage('Invalid habit ID'),
];

router.use(auth);
router.post('/', habitValidation, validate, createHabit);
router.get('/', getHabits);
router.put('/:id', mongoIdParam, habitValidation, validate, updateHabit);
router.delete('/:id', mongoIdParam, validate, deleteHabit);
router.post('/:id/checkin', mongoIdParam, validate, checkIn);
router.get('/analytics/weekly', weeklyAnalytics);

module.exports = router;
