const express = require('express');
const {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
  getUserOrders,
  processRefund,
  getOrdersByStatus,
  exportOrders
} = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Customer routes
router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrder);
router.patch('/:id/cancel', cancelOrder);

// Admin/Staff routes
router.use(restrictTo('admin', 'staff'));

router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/refund', processRefund);
router.get('/stats/overview', getOrderStats);
router.get('/user/:userId', getUserOrders);
router.get('/status/:status', getOrdersByStatus);
router.get('/export/data', exportOrders);

module.exports = router;
