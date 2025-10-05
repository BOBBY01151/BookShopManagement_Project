const express = require('express');
const {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
  markHelpful,
  reportReview,
  addResponse,
  approveReview,
  getReviewStats,
  getUserReviews,
  getBookReviews
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllReviews);
router.get('/book/:bookId', getBookReviews);
router.get('/:id', getReview);

// Protected routes
router.use(protect);

router.post('/', createReview);
router.patch('/:id', updateReview);
router.delete('/:id', deleteReview);
router.patch('/:id/helpful', markHelpful);
router.patch('/:id/report', reportReview);
router.get('/user/:userId', getUserReviews);

// Admin/Staff routes
router.use(restrictTo('admin', 'staff'));

router.patch('/:id/response', addResponse);
router.patch('/:id/approve', approveReview);
router.get('/stats/overview', getReviewStats);

module.exports = router;
