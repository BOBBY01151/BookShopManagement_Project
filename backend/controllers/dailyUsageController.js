const DailyUsage = require('../models/DailyUsage');
const Product = require('../models/Product');

// Record new usage and decrement product stock
exports.recordUsage = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // 1) Find product
    const product = await Product.findOne({ _id: productId, createdBy: req.user.id });
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found'
      });
    }

    // 2) Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        status: 'fail',
        message: `Insufficient stock. Only ${product.stock} units available.`
      });
    }

    // 3) Create usage record
    const usage = await DailyUsage.create({
      product: productId,
      quantity,
      recordedBy: req.user.id,
      totalValueImpact: product.price * quantity
    });

    // 4) Decrement product stock
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });

    res.status(201).json({
      status: 'success',
      data: {
        usage
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

// Get usage history for today
exports.getTodayUsage = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const usage = await DailyUsage.find({
      recordedBy: req.user.id,
      recordedAt: { $gte: startOfDay }
    })
    .populate('product', 'title price category')
    .sort('-recordedAt');

    res.status(200).json({
      status: 'success',
      results: usage.length,
      data: {
        usage
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};
