const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { sendMessage, getHistory, clearHistory } = require('../controllers/chatController');

router.use(auth);

router.get('/', getHistory);
router.post('/', sendMessage);
router.delete('/', clearHistory);

module.exports = router;
