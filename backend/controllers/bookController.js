const Book = require('../models/Book');
const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getAllBooks = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Book.find({ isActive: true }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const books = await features.query.populate('createdBy', 'name email');

  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      books
    }
  });
});

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  if (!book || !book.isActive) {
    return next(new AppError('No book found with that ID', 404));
  }

  // Get related books (same category)
  const relatedBooks = await Book.find({
    category: book.category,
    _id: { $ne: book._id },
    isActive: true
  })
    .limit(4)
    .select('title author price image rating category');

  // Get reviews for this book
  const reviews = await Review.findByBook(book._id, {
    approved: true,
    limit: 5,
    sortBy: 'newest'
  });

  res.status(200).json({
    status: 'success',
    data: {
      book,
      relatedBooks,
      reviews
    }
  });
});

// @desc    Create new book
// @route   POST /api/books
// @access  Private (Admin/Staff)
exports.createBook = catchAsync(async (req, res, next) => {
  // Add user to request body
  req.body.createdBy = req.user.id;

  const book = await Book.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      book
    }
  });
});

// @desc    Update book
// @route   PATCH /api/books/:id
// @access  Private (Admin/Staff)
exports.updateBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(new AppError('No book found with that ID', 404));
  }

  // Add user to request body
  req.body.updatedBy = req.user.id;

  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      book: updatedBook
    }
  });
});

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Admin/Staff)
exports.deleteBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(new AppError('No book found with that ID', 404));
  }

  // Soft delete - set isActive to false
  book.isActive = false;
  await book.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// @desc    Search books
// @route   GET /api/books/search
// @access  Public
exports.searchBooks = catchAsync(async (req, res, next) => {
  const {
    q: query,
    category,
    minPrice,
    maxPrice,
    inStock,
    sortBy,
    page = 1,
    limit = 12
  } = req.query;

  const books = await Book.searchBooks(query, {
    category,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    inStock: inStock === 'true',
    sortBy,
    page: parseInt(page),
    limit: parseInt(limit)
  });

  // Get total count for pagination
  const totalCount = await Book.countDocuments({
    isActive: true,
    ...(query && { $text: { $search: query } }),
    ...(category && { category }),
    ...(minPrice || maxPrice ? {
      price: {
        ...(minPrice && { $gte: parseFloat(minPrice) }),
        ...(maxPrice && { $lte: parseFloat(maxPrice) })
      }
    } : {}),
    ...(inStock === 'true' && { stock: { $gt: 0 } })
  });

  res.status(200).json({
    status: 'success',
    results: books.length,
    totalCount,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalCount / parseInt(limit)),
    data: {
      books
    }
  });
});

// @desc    Get featured books
// @route   GET /api/books/featured
// @access  Public
exports.getFeaturedBooks = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const books = await Book.findFeatured(limit);

  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      books
    }
  });
});

// @desc    Get new books
// @route   GET /api/books/new
// @access  Public
exports.getNewBooks = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const books = await Book.findNew(limit);

  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      books
    }
  });
});

// @desc    Get books on sale
// @route   GET /api/books/sale
// @access  Public
exports.getBooksOnSale = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const books = await Book.findOnSale(limit);

  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      books
    }
  });
});

// @desc    Get books by category
// @route   GET /api/books/category/:category
// @access  Public
exports.getBooksByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.params;
  const { page = 1, limit = 12, sortBy = 'newest' } = req.query;

  const features = new APIFeatures(
    Book.find({ category, isActive: true }),
    { page, limit, sort: sortBy }
  )
    .sort()
    .paginate();

  const books = await features.query;

  const totalCount = await Book.countDocuments({ category, isActive: true });

  res.status(200).json({
    status: 'success',
    results: books.length,
    totalCount,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalCount / parseInt(limit)),
    data: {
      books
    }
  });
});

// @desc    Get book statistics
// @route   GET /api/books/stats
// @access  Private (Admin/Staff)
exports.getBookStats = catchAsync(async (req, res, next) => {
  const stats = await Book.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalStock: { $sum: '$stock' },
        averagePrice: { $avg: '$price' },
        totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
      }
    },
    { $sort: { count: -1 } }
  ]);

  const totalBooks = await Book.countDocuments({ isActive: true });
  const totalStock = await Book.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, total: { $sum: '$stock' } } }
  ]);

  const lowStockBooks = await Book.countDocuments({
    isActive: true,
    stock: { $lt: 10 }
  });

  const outOfStockBooks = await Book.countDocuments({
    isActive: true,
    stock: 0
  });

  res.status(200).json({
    status: 'success',
    data: {
      byCategory: stats,
      totalBooks,
      totalStock: totalStock[0]?.total || 0,
      lowStockBooks,
      outOfStockBooks
    }
  });
});

// @desc    Update book stock
// @route   PATCH /api/books/:id/stock
// @access  Private (Admin/Staff)
exports.updateBookStock = catchAsync(async (req, res, next) => {
  const { stock } = req.body;

  if (stock < 0) {
    return next(new AppError('Stock cannot be negative', 400));
  }

  const book = await Book.findByIdAndUpdate(
    req.params.id,
    { stock },
    { new: true, runValidators: true }
  );

  if (!book) {
    return next(new AppError('No book found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      book
    }
  });
});

// @desc    Bulk update books
// @route   PATCH /api/books/bulk-update
// @access  Private (Admin/Staff)
exports.bulkUpdateBooks = catchAsync(async (req, res, next) => {
  const { bookIds, updateData } = req.body;

  if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
    return next(new AppError('Please provide an array of book IDs', 400));
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    return next(new AppError('Please provide update data', 400));
  }

  // Add updatedBy to update data
  updateData.updatedBy = req.user.id;

  const result = await Book.updateMany(
    { _id: { $in: bookIds } },
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

// @desc    Get book reviews
// @route   GET /api/books/:id/reviews
// @access  Public
exports.getBookReviews = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { page = 1, limit = 10, sortBy = 'newest', minRating, maxRating } = req.query;

  const reviews = await Review.findByBook(id, {
    approved: true,
    sortBy,
    limit: parseInt(limit),
    page: parseInt(page),
    minRating: minRating ? parseInt(minRating) : undefined,
    maxRating: maxRating ? parseInt(maxRating) : undefined
  });

  const totalCount = await Review.countDocuments({
    book: id,
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
