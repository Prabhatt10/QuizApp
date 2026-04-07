const express = require('express');
const router = express.Router();
const { submitAttempt, getMyAttempts } = require('../controllers/attemptController');
const auth = require('../middleware/auth');

router.post('/', auth, submitAttempt);
router.get('/my', auth, getMyAttempts);

module.exports = router;
