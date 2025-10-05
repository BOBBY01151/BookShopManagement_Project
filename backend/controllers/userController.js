const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin/Staff)
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query.select('-password');

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin/Staff)
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// @desc    Create new user
// @route   POST /api/users
// @access  Private (Admin/Staff)
exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: user.getPublicProfile()
    }
  });
});

// @desc    Update user
// @route   PATCH /api/users/:id
// @access  Private (Admin/Staff)
exports.updateUser = catchAsync(async (req, res, next) => {
  // Don't allow password updates through this route
  if (req.body.password) {
    return next(new AppError('This route is not for password updates', 400));
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).select('-password');

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  // Don't allow admin to delete themselves
  if (user._id.toString() === req.user.id) {
    return next(new AppError('You cannot delete your own account', 400));
  }

  // Soft delete - set isActive to false
  user.isActive = false;
  await user.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// @desc    Get user profile
// @route   GET /api/users/profile/:id
// @access  Private
exports.getUserProfile = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  
  // Users can only view their own profile unless they're admin/staff
  if (req.user.role !== 'admin' && req.user.role !== 'staff' && req.user.id !== userId) {
    return next(new AppError('You can only view your own profile', 403));
  }

  const user = await User.findById(userId).select('-password');

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  // Get user's order statistics
  const orderStats = await Order.aggregate([
    { $match: { user: user._id } },
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 },
        totalValue: { $sum: '$total' }
      }
    }
  ]);

  // Get user's review statistics
  const reviewStats = await Review.aggregate([
    { $match: { user: user._id, isApproved: true } },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  // Get recent orders
  const recentOrders = await Order.find({ user: user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('orderNumber orderStatus total createdAt')
    .populate('items.book', 'title image');

  // Get recent reviews
  const recentReviews = await Review.find({ user: user._id, isApproved: true })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('rating title comment createdAt')
    .populate('book', 'title image');

  res.status(200).json({
    status: 'success',
    data: {
      user,
      statistics: {
        orders: orderStats,
        reviews: reviewStats[0] || { totalReviews: 0, averageRating: 0 }
      },
      recentOrders,
      recentReviews
    }
  });
});

// @desc    Update user role
// @route   PATCH /api/users/:id/role
// @access  Private (Admin)
exports.updateUserRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;

  if (!['admin', 'staff', 'customer'].includes(role)) {
    return next(new AppError('Invalid role. Must be admin, staff, or customer', 400));
  }

  // Don't allow admin to change their own role
  if (req.params.id === req.user.id) {
    return next(new AppError('You cannot change your own role', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// @desc    Toggle user active status
// @route   PATCH /api/users/:id/toggle-active
// @access  Private (Admin/Staff)
exports.toggleUserActive = catchAsync(async (req, res, next) => {
  // Don't allow admin to deactivate themselves
  if (req.params.id === req.user.id) {
    return next(new AppError('You cannot deactivate your own account', 400));
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user: user.getPublicProfile()
    }
  });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private (Admin/Staff)
exports.getUserStats = catchAsync(async (req, res, next) => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        activeCount: {
          $sum: { $cond: ['$isActive', 1, 0] }
        }
      }
    }
  ]);

  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
  });

  // Get user registration trend (last 12 months)
  const registrationTrend = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
        }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      byRole: stats,
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      registrationTrend
    }
  });
});

// @desc    Search users
// @route   GET /api/users/search
// @access  Private (Admin/Staff)
exports.searchUsers = catchAsync(async (req, res, next) => {
  const { q: query, role, isActive, page = 1, limit = 10 } = req.query;

  let searchQuery = {};

  // Text search
  if (query) {
    searchQuery.$or = [
      { name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } }
    ];
  }

  // Role filter
  if (role) {
    searchQuery.role = role;
  }

  // Active status filter
  if (isActive !== undefined) {
    searchQuery.isActive = isActive === 'true';
  }

  const skip = (page - 1) * limit;

  const users = await User.find(searchQuery)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalCount = await User.countDocuments(searchQuery);

  res.status(200).json({
    status: 'success',
    results: users.length,
    totalCount,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalCount / parseInt(limit)),
    data: {
      users
    }
  });
});

// @desc    Bulk update users
// @route   PATCH /api/users/bulk-update
// @access  Private (Admin/Staff)
exports.bulkUpdateUsers = catchAsync(async (req, res, next) => {
  const { userIds, updateData } = req.body;

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return next(new AppError('Please provide an array of user IDs', 400));
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    return next(new AppError('Please provide update data', 400));
  }

  // Don't allow password updates through bulk update
  if (updateData.password) {
    return next(new AppError('Password updates are not allowed in bulk operations', 400));
  }

  const result = await User.updateMany(
    { _id: { $in: userIds } },
    updateData,
    { runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    }
  });
});

// @desc    Export users
// @route   GET /api/users/export
// @access  Private (Admin/Staff)
exports.exportUsers = catchAsync(async (req, res, next) => {
  const { role, isActive, format = 'json' } = req.query;

  let query = {};
  
  // Role filter
  if (role) {
    query.role = role;
  }
  
  // Active status filter
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const users = await User.find(query)
    .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires')
    .sort({ createdAt: -1 });

  if (format === 'csv') {
    // Convert to CSV format
    const csvData = users.map(user => ({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    
    // Simple CSV conversion
    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    res.send(csv);
  } else {
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  }
});
