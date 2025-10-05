const Order = require('../models/Order');
const Book = require('../models/Book');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = catchAsync(async (req, res, next) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    notes,
    isGift,
    giftMessage,
    isGiftWrapped,
    giftWrapCost
  } = req.body;

  // Validate items
  if (!items || items.length === 0) {
    return next(new AppError('Order must contain at least one item', 400));
  }

  // Check stock availability and calculate totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const book = await Book.findById(item.book);
    
    if (!book || !book.isActive) {
      return next(new AppError(`Book with ID ${item.book} not found`, 404));
    }

    if (book.stock < item.quantity) {
      return next(new AppError(`Insufficient stock for ${book.title}. Available: ${book.stock}`, 400));
    }

    const itemTotal = book.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      book: book._id,
      title: book.title,
      author: book.author,
      price: book.price,
      quantity: item.quantity,
      image: book.image
    });
  }

  // Calculate shipping cost (free over $50)
  const shippingCost = subtotal > 50 ? 0 : 9.99;

  // Calculate tax (8%)
  const tax = subtotal * 0.08;

  // Calculate total
  const total = subtotal + shippingCost + tax + (giftWrapCost || 0);

  // Create order
  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingCost,
    tax,
    total,
    notes,
    isGift,
    giftMessage,
    isGiftWrapped,
    giftWrapCost: giftWrapCost || 0
  });

  // Update book stock
  for (const item of items) {
    await Book.findByIdAndUpdate(
      item.book,
      { $inc: { stock: -item.quantity } },
      { new: true }
    );
  }

  // Populate order data
  await order.populate('user', 'name email');
  await order.populate('items.book', 'title author image');

  res.status(201).json({
    status: 'success',
    data: {
      order
    }
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const { status, page = 1, limit = 10 } = req.query;
  
  let query = {};
  
  // If user is not admin, only show their orders
  if (req.user.role !== 'admin') {
    query.user = req.user.id;
  }
  
  // Filter by status if provided
  if (status) {
    query.orderStatus = status;
  }

  const skip = (page - 1) * limit;

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('user', 'name email')
    .populate('items.book', 'title author image');

  const totalCount = await Order.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: orders.length,
    totalCount,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalCount / parseInt(limit)),
    data: {
      orders
    }
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = catchAsync(async (req, res, next) => {
  let query = { _id: req.params.id };
  
  // If user is not admin, only allow access to their own orders
  if (req.user.role !== 'admin') {
    query.user = req.user.id;
  }

  const order = await Order.findOne(query)
    .populate('user', 'name email phone')
    .populate('items.book', 'title author image');

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Admin/Staff)
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status, notes, trackingNumber, trackingUrl } = req.body;

  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  // Update order status
  await order.updateStatus(status, notes);

  // Add tracking information if provided
  if (trackingNumber && status === 'shipped') {
    await order.addTracking(trackingNumber, trackingUrl);
  }

  // Populate order data
  await order.populate('user', 'name email');
  await order.populate('items.book', 'title author image');

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  let query = { _id: req.params.id };
  
  // If user is not admin, only allow cancellation of their own orders
  if (req.user.role !== 'admin') {
    query.user = req.user.id;
  }

  const order = await Order.findOne(query);
  
  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  // Check if order can be cancelled
  if (!order.canBeCancelled) {
    return next(new AppError('Order cannot be cancelled in its current status', 400));
  }

  // Cancel order
  await order.cancel(reason);

  // Restore book stock
  for (const item of order.items) {
    await Book.findByIdAndUpdate(
      item.book,
      { $inc: { stock: item.quantity } },
      { new: true }
    );
  }

  // Populate order data
  await order.populate('user', 'name email');
  await order.populate('items.book', 'title author image');

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private (Admin/Staff)
exports.getOrderStats = catchAsync(async (req, res, next) => {
  const stats = await Order.getStats();

  // Get additional statistics
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const monthlyStats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfMonth },
        orderStatus: 'delivered'
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        revenue: { $sum: '$total' }
      }
    }
  ]);

  const yearlyStats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfYear },
        orderStatus: 'delivered'
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        revenue: { $sum: '$total' }
      }
    }
  ]);

  const topSellingBooks = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.book',
        title: { $first: '$items.title' },
        totalSold: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      ...stats,
      monthly: monthlyStats[0] || { count: 0, revenue: 0 },
      yearly: yearlyStats[0] || { count: 0, revenue: 0 },
      topSellingBooks
    }
  });
});

// @desc    Get user orders
// @route   GET /api/orders/user/:userId
// @access  Private (Admin/Staff)
exports.getUserOrders = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { status, limit = 10, page = 1 } = req.query;

  const orders = await Order.findByUser(userId, {
    status,
    limit: parseInt(limit),
    page: parseInt(page)
  });

  const totalCount = await Order.countDocuments({
    user: userId,
    ...(status && { orderStatus: status })
  });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    totalCount,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalCount / parseInt(limit)),
    data: {
      orders
    }
  });
});

// @desc    Process refund
// @route   PATCH /api/orders/:id/refund
// @access  Private (Admin/Staff)
exports.processRefund = catchAsync(async (req, res, next) => {
  const { refundAmount, reason } = req.body;

  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  if (refundAmount > order.total) {
    return next(new AppError('Refund amount cannot exceed order total', 400));
  }

  // Update order with refund information
  order.refundAmount = refundAmount;
  order.refundReason = reason;
  order.refundedAt = new Date();
  order.paymentStatus = refundAmount === order.total ? 'refunded' : 'partially_refunded';
  
  await order.save();

  // Populate order data
  await order.populate('user', 'name email');
  await order.populate('items.book', 'title author image');

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

// @desc    Get orders by status
// @route   GET /api/orders/status/:status
// @access  Private (Admin/Staff)
exports.getOrdersByStatus = catchAsync(async (req, res, next) => {
  const { status } = req.params;
  const { limit = 50, page = 1 } = req.query;

  const orders = await Order.findByStatus(status, {
    limit: parseInt(limit),
    page: parseInt(page)
  });

  const totalCount = await Order.countDocuments({ orderStatus: status });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    totalCount,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalCount / parseInt(limit)),
    data: {
      orders
    }
  });
});

// @desc    Export orders
// @route   GET /api/orders/export
// @access  Private (Admin/Staff)
exports.exportOrders = catchAsync(async (req, res, next) => {
  const { startDate, endDate, status, format = 'json' } = req.query;

  let query = {};
  
  // Date range filter
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  // Status filter
  if (status) {
    query.orderStatus = status;
  }

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .populate('user', 'name email')
    .populate('items.book', 'title author');

  if (format === 'csv') {
    // Convert to CSV format
    const csvData = orders.map(order => ({
      orderNumber: order.orderNumber,
      customerName: order.user.name,
      customerEmail: order.user.email,
      status: order.orderStatus,
      total: order.total,
      createdAt: order.createdAt,
      items: order.items.map(item => `${item.title} (${item.quantity})`).join('; ')
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
    
    // Simple CSV conversion
    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    res.send(csv);
  } else {
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders
      }
    });
  }
});
