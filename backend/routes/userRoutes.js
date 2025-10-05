const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserRole,
  toggleUserActive,
  getUserStats,
  searchUsers,
  bulkUpdateUsers,
  exportUsers
} = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// User profile routes (accessible to all authenticated users)
router.get('/profile/:id', getUserProfile);

// Admin/Staff routes
router.use(restrictTo('admin', 'staff'));

router.get('/', getAllUsers);
router.get('/search', searchUsers);
router.get('/stats/overview', getUserStats);
router.get('/export/data', exportUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/role', updateUserRole);
router.patch('/:id/toggle-active', toggleUserActive);
router.patch('/bulk-update', bulkUpdateUsers);

module.exports = router;
