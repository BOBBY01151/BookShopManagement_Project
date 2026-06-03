const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
exports.getProducts = catchAsync(async (req, res, next) => {
  try {
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 2) Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 3) Filter strictly by logged-in User (Ownership Isolation)
    if (req.user && req.user.id) {
      queryObj.createdBy = req.user.id;
    }

    // 4) Execute Query
    const totalItems = await Product.countDocuments(queryObj);
    const products = await Product.find(queryObj)
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: 'success',
      total: totalItems,
      page,
      pages: Math.ceil(totalItems / limit) || 1,
      results: products.length,
      data: {
        products
      }
    });
  } catch (error) {
    console.error('SERVER_ERROR in getProducts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products from database',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = catchAsync(async (req, res, next) => {
  try {
    // Associate product with the current administrator
    const productData = {
      ...req.body,
      createdBy: req.user.id
    };

    const product = await Product.create(productData);
    console.log('Product Created Successfully:', product._id);

    res.status(201).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('DATABASE_ERROR in createProduct:', error);
    
    // 1) Handle Duplicate Key Error (SKU)
    if (error.code === 11000 || error.name === 'MongoServerError' && error.message.includes('E11000')) {
      return res.status(400).json({
        status: 'fail',
        message: 'A product with this SKU already exists. Please use a unique SKU or leave it blank.'
      });
    }

    // 2) Handle Validation Errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(el => el.message);
      return res.status(400).json({
        status: 'fail',
        message: `Invalid data: ${messages.join('. ')}`
      });
    }

    // 3) Fallback for other errors
    res.status(500).json({
      status: 'error',
      message: error.message || 'An unexpected error occurred while saving the product'
    });
  }
});

// @desc    Update product
// @route   PATCH /api/products/:id
// @access  Private/Admin
exports.updateProduct = catchAsync(async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('DATABASE_ERROR in updateProduct:', error);
    
    // Handle Duplicate Key Error (SKU)
    if (error.code === 11000 || error.name === 'MongoServerError' && error.message.includes('E11000')) {
      return res.status(400).json({
        status: 'fail',
        message: 'Another product already uses this SKU. Please use a unique SKU.'
      });
    }

    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update product'
    });
  }
});

// @desc    Get inventory stats for dashboard
// @route   GET /api/products/stats
// @access  Private/Admin
exports.getInventoryStats = catchAsync(async (req, res, next) => {
  const Category = require('../models/Category');
  const mongoose = require('mongoose');

  // 1) Get all defined categories for the current user
  const allCategories = await Category.find({ createdBy: req.user.id }).select('name');
  
  // 2) Get product metrics grouped by category for the current user
  const productStats = await Product.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.id)
      }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        stock: { $sum: '$stock' },
        value: { $sum: { $multiply: ['$price', '$stock'] } }
      }
    }
  ]);

  // 3) Merge: Ensure every category exists in the final list
  const finalCategories = allCategories.map(cat => {
    const stats = productStats.find(p => p._id === cat.name);
    return {
      _id: cat.name,
      count: stats?.count || 0,
      stock: stats?.stock || 0,
      value: stats?.value || 0
    };
  });

  // 4) Get overall summary for the current user
  const summary = await Product.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.id)
      }
    },
    {
      $group: {
        _id: null,
        totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
        totalStock: { $sum: '$stock' },
        totalProducts: { $count: {} },
        averagePrice: { $avg: '$price' }
      }
    }
  ]);

  // 5) Get top metrics
  const topValuedCategory = [...finalCategories].sort((a, b) => b.value - a.value)[0];
  
  const highestValueProduct = await Product.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.id)
      }
    },
    {
      $project: {
        title: 1,
        totalValue: { $multiply: ['$price', '$stock'] }
      }
    },
    { $sort: { totalValue: -1 } },
    { $limit: 1 }
  ]);

  // 6) Get low stock count for the current user
  const lowStock = await Product.countDocuments({
    createdBy: req.user.id,
    stock: { $lt: 10 }
  });

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        summary: summary[0] || { totalValue: 0, totalStock: 0, totalProducts: 0, averagePrice: 0 },
        categories: finalCategories.sort((a, b) => b.stock - a.stock),
        topValuedCategory: topValuedCategory || null,
        highestValueProduct: highestValueProduct[0] || null,
        lowStock: [{ count: lowStock }]
      }
    }
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
