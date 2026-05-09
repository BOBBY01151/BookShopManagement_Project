const mongoose = require('mongoose');

const dailyUsageSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Usage must belong to a product']
  },
  quantity: {
    type: Number,
    required: [true, 'Usage must have a quantity'],
    min: [1, 'Quantity must be at least 1']
  },
  recordedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Usage must be recorded by a user']
  },
  totalValueImpact: {
    type: Number,
    required: true
  },
  recordedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster history lookups
dailyUsageSchema.index({ recordedAt: -1 });

const DailyUsage = mongoose.model('DailyUsage', dailyUsageSchema);

module.exports = DailyUsage;
