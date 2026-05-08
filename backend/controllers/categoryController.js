const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find().sort('name');

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories
    }
  });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = catchAsync(async (req, res, next) => {
  // Add user to the body
  req.body.createdBy = req.user.id;

  const category = await Category.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      category
    }
  });
});

// @desc    Update category
// @route   PATCH /api/categories/:id
// @access  Private/Admin
exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      category
    }
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
