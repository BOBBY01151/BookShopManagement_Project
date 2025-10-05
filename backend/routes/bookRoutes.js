const express = require('express');
const {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
  getFeaturedBooks,
  getNewBooks,
  getBooksOnSale,
  getBooksByCategory,
  getBookStats,
  updateBookStock,
  bulkUpdateBooks,
  getBookReviews
} = require('../controllers/bookController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/featured', getFeaturedBooks);
router.get('/new', getNewBooks);
router.get('/sale', getBooksOnSale);
router.get('/category/:category', getBooksByCategory);
router.get('/:id', getBook);
router.get('/:id/reviews', getBookReviews);

// Protected routes (Admin/Staff only)
router.use(protect);
router.use(restrictTo('admin', 'staff'));

router.post('/', createBook);
router.patch('/:id', updateBook);
router.delete('/:id', deleteBook);
router.get('/stats/overview', getBookStats);
router.patch('/:id/stock', updateBookStock);
router.patch('/bulk-update', bulkUpdateBooks);

module.exports = router;
