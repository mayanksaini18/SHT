const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { exportJson, exportCsv } = require('../controllers/exportController');

router.use(auth);
router.get('/json', exportJson);
router.get('/csv', exportCsv);

module.exports = router;
