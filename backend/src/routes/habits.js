const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { createHabit, getHabits, checkIn } = require('../controllers/habitController');

router.use(auth);
router.post('/', createHabit);
router.get('/', getHabits);
router.post('/:id/checkin', checkIn);

module.exports = router;
