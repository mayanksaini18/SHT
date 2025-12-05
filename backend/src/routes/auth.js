const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { register, login, refreshToken,getMe } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
//protected route
router.get('/me', auth, getMe)

module.exports = router;
