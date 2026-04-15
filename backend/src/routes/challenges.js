const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getChallenges } = require('../controllers/challengeController');

router.use(auth);
router.get('/', getChallenges);

module.exports = router;
