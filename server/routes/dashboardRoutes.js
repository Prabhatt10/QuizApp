const express = require('express');
const router = express.Router();
const { getLeaderboard, getAdminStats } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/leaderboard', auth, getLeaderboard);
router.get('/admin-stats', auth, admin, getAdminStats);

module.exports = router;
