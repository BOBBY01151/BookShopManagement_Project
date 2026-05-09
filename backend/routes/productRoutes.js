const express = require('express');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getInventoryStats
} = require('../controllers/productController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// All product routes are protected
router.use(protect);

router
  .route('/')
  .get(getProducts)
  .post(restrictTo('admin'), createProduct);

router.get('/stats', restrictTo('admin'), getInventoryStats);

router
  .route('/:id')
  .patch(restrictTo('admin'), updateProduct)
  .delete(restrictTo('admin'), deleteProduct);

module.exports = router;
