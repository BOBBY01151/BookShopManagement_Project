const express = require('express');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// All category routes are protected
router.use(protect);

router
  .route('/')
  .get(getCategories)
  .post(restrictTo('admin'), createCategory);

router
  .route('/:id')
  .patch(restrictTo('admin'), updateCategory)
  .delete(restrictTo('admin'), deleteCategory);

module.exports = router;
