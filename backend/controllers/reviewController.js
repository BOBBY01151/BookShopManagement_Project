const Review = require('../models/Review');
const Book = require('../models/Book');
const Order = require('../models/Order');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = catchAsync(async (req, res, next) => {
  const { book, order, rating, title, comment, images, tags } = req.body;

  // Check if user has purchased this book
  const orderExists = await Order.findOne({
    _id: order,
    user: req.user.id,
    orderStatus: 'delivered',
    'items.book': book
  });

  if (!orderExists) {
    return next(new AppError('You can only review books you have purchased and received', 400));
  }

  // Check if user has already reviewed this book for this order
  const existingReview = await Review.findOne({
    user: req.user.id,
    book,
    order
  });

  if (existingReview) {
    return next(new AppError('You have already reviewed this book for this order', 400));
  }

  // Create review
  const review = await Review.create({
    user: req.user.id,
    book,
    order,
    rating,
    title,
    comment,
    images,
    tags
  });

  // Populate review data
  await review.populate('user', 'name avatar');
  await review.populate('book', 'title author image');

  res.status(201).json({
    status: 'success',
    data: {
      review
    }
  });
});

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const { 
    book, 
    user, 
    rating, 
    approved = true, 
    page = 1, 
    limit = 10, 
    sortBy = 'newest' 
  } = req.query;

  let query = {};
  
  if (book) query.book = book;
  if (user) query.user = user;
  if (rating) query.rating = parseInt(rating);
  if (approved !== undefined) query.isApproved = approved === 'true';

  let sort = {};
  switch (sortBy) {
    case 'newest':
      sort = { createdAt: -1 };
      break;
    case 'oldest':
      sort = { createdAt: 1 };
      break;
    case 'highest':
      sort = { rating: -1 };
      break;
    case 'lowest':
      sort = { rating: 1 };
      break;
    case 'most_helpful':
      sort = { 'isHelpful.count': -1 };
      break;
    default:
      sort = { createdAt: -1 };
  }

  const skip = (page - 1) * limit;

  const reviews = await Review.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('user', 'name avatar')
    .populate('book', 'title author image')
    .populate('response.respondedBy', 'name');

  const totalCount = await Review.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    totalCount,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalCount / parseInt(limit)),
    data: {
      reviews
    }
  });
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate('user', 'name avatar')
    .populate('book', 'title author image')
    .populate('order', 'orderNumber')
    .populate('response.respondedBy', 'name');

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

// @desc    Update review
// @route   PATCH /api/reviews/:id
// @access  Private
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  // Check if user owns the review or is admin/staff
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'staff') {
    return next(new AppError('You can only update your own reviews', 403));
  }

  // Filter allowed fields for regular users
  const allowedFields = ['rating', 'title', 'comment', 'images', 'tags'];
  const filteredBody = {};

  if (req.user.role === 'admin' || req.user.role === 'staff') {
    // Admins can update any field
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        filteredBody[key] = req.body[key];
      }
    });
  } else {
    // Regular users can only update specific fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        filteredBody[field] = req.body[field];
      }
    });
  }

  const updatedReview = await Review.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true
  })
    .populate('user', 'name avatar')
    .populate('book', 'title author image')
    .populate('response.respondedBy', 'name');

  res.status(200).json({
    status: 'success',
    data: {
      review: updatedReview
    }
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  // Check if user owns the review or is admin/staff
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'staff') {
    return next(new AppError('You can only delete your own reviews', 403));
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// @desc    Mark review as helpful
// @route   PATCH /api/reviews/:id/helpful
// @access  Private
exports.markHelpful = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  await review.markHelpful(req.user.id);

  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

// @desc    Report review
// @route   PATCH /api/reviews/:id/report
// @access  Private
exports.reportReview = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  if (!reason) {
    return next(new AppError('Please provide a reason for reporting', 400));
  }

  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  // Don't allow users to report their own reviews
  if (review.user.toString() === req.user.id) {
    return next(new AppError('You cannot report your own review', 400));
  }

  await review.report(req.user.id, reason);

  res.status(200).json({
    status: 'success',
    message: 'Review reported successfully'
  });
});

// @desc    Add response to review
// @route   PATCH /api/reviews/:id/response
// @access  Private (Admin/Staff)
exports.addResponse = catchAsync(async (req, res, next) => {
  const { text } = req.body;

  if (!text) {
    return next(new AppError('Please provide response text', 400));
  }

  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  await review.addResponse(text, req.user.id);

  const updatedReview = await Review.findById(req.params.id)
    .populate('user', 'name avatar')
    .populate('book', 'title author image')
    .populate('response.respondedBy', 'name');

  res.status(200).json({
    status: 'success',
    data: {
      review: updatedReview
    }
  });
});

// @desc    Approve/Disapprove review
// @route   PATCH /api/reviews/:id/approve
// @access  Private (Admin/Staff)
exports.approveReview = catchAsync(async (req, res, next) => {
  const { approved } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  review.isApproved = approved;
  review.approvedBy = req.user.id;
  review.approvedAt = new Date();

  await review.save();

  const updatedReview = await Review.findById(req.params.id)
    .populate('user', 'name avatar')
    .populate('book', 'title author image')
    .populate('approvedBy', 'name');

  res.status(200).json({
    status: 'success',
    data: {
      review: updatedReview
    }
  });
});

// @desc    Get review statistics
// @route   GET /api/reviews/stats
// @access  Private (Admin/Staff)
exports.getReviewStats = catchAsync(async (req, res, next) => {
  const stats = await Review.getStats();

  // Get additional statistics
  const totalReviews = await Review.countDocuments();
  const approvedReviews = await Review.countDocuments({ isApproved: true });
  const pendingReviews = await Review.countDocuments({ isApproved: false });
  const reportedReviews = await Review.countDocuments({ 'isReported.count': { $gt: 0 } });

  // Get reviews by month (last 12 months)
  const monthlyStats = await Review.aggregate([
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
        count: { $sum: 1 },
        averageRating: { $avg: '$rating' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Get top reviewed books
  const topReviewedBooks = await Review.aggregate([
    { $match: { isApproved: true } },
    {
      $group: {
        _id: '$book',
        reviewCount: { $sum: 1 },
        averageRating: { $avg: '$rating' }
      }
    },
    { $sort: { reviewCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'books',
        localField: '_id',
        foreignField: '_id',
        as: 'book'
      }
    },
    { $unwind: '$book' },
    {
      $project: {
        book: { title: 1, author: 1, image: 1 },
        reviewCount: 1,
        averageRating: { $round: ['$averageRating', 1] }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      ...stats,
      totalReviews,
      approvedReviews,
      pendingReviews,
      reportedReviews,
      monthlyStats,
      topReviewedBooks
    }
  });
});

// @desc    Get user reviews
// @route   GET /api/reviews/user/:userId
// @access  Private
exports.getUserReviews = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Users can only view their own reviews unless they're admin/staff
  if (req.user.role !== 'admin' && req.user.role !== 'staff' && req.user.id !== userId) {
    return next(new AppError('You can only view your own reviews', 403));
  }

  const reviews = await Review.findByUser(userId, {
    approved: true,
    limit: parseInt(limit),
    page: parseInt(page)
  });

  const totalCount = await Review.countDocuments({
    user: userId,
    isApproved: true
  });

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    totalCount,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalCount / parseInt(limit)),
    data: {
      reviews
    }
  });
});

// @desc    Get book reviews
// @route   GET /api/reviews/book/:bookId
// @access  Public
exports.getBookReviews = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const { page = 1, limit = 10, sortBy = 'newest', minRating, maxRating } = req.query;

  const reviews = await Review.findByBook(bookId, {
    approved: true,
    sortBy,
    limit: parseInt(limit),
    page: parseInt(page),
    minRating: minRating ? parseInt(minRating) : undefined,
    maxRating: maxRating ? parseInt(maxRating) : undefined
  });

  const totalCount = await Review.countDocuments({
    book: bookId,
    isApproved: true,
    ...(minRating || maxRating ? {
      rating: {
        ...(minRating && { $gte: parseInt(minRating) }),
        ...(maxRating && { $lte: parseInt(maxRating) })
      }
    } : {})
  });

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    totalCount,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalCount / parseInt(limit)),
    data: {
      reviews
    }
  });
});
