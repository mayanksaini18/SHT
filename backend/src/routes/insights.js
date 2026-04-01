const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getWeeklyReport, getInsights } = require('../controllers/insightController');

router.use(auth);
router.get('/weekly', getWeeklyReport);
router.get('/', getInsights);

module.exports = router;
