const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { logMood, getMoods, getMoodTrends, updateMood, deleteMood } = require('../controllers/moodController');

const moodValidation = [
  body('score').isInt({ min: 1, max: 5 }).withMessage('Score must be between 1 and 5'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notes must be under 1000 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
];

router.use(auth);
router.post('/', moodValidation, validate, logMood);
router.get('/', getMoods);
router.get('/trends', getMoodTrends);
router.put('/:id', [param('id').isMongoId()], moodValidation, validate, updateMood);
router.delete('/:id', [param('id').isMongoId()], validate, deleteMood);

module.exports = router;
