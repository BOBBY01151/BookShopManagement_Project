const express = require('express');
const dailyUsageController = require('../controllers/dailyUsageController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(dailyUsageController.getTodayUsage)
  .post(dailyUsageController.recordUsage);

module.exports = router;
