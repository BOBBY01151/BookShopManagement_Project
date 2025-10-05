const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    max: [100, 'Quantity cannot exceed 100']
  },
  image: String
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Shipping name is required'],
    trim: true
  },
  street: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  zipCode: {
    type: String,
    required: [true, 'ZIP code is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    default: 'United States',
    trim: true
  },
  phone: {
    type: String,
    trim: true
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: {
      values: ['credit_card', 'debit_card', 'paypal', 'stripe', 'cash_on_delivery'],
      message: 'Payment method must be one of: credit_card, debit_card, paypal, stripe, cash_on_delivery'
    }
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      message: 'Payment status must be one of: pending, paid, failed, refunded, partially_refunded'
    },
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      message: 'Order status must be one of: pending, confirmed, processing, shipped, delivered, cancelled, returned'
    },
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  shippingCost: {
    type: Number,
    required: true,
    min: [0, 'Shipping cost cannot be negative'],
    default: 0
  },
  tax: {
    type: Number,
    required: true,
    min: [0, 'Tax cannot be negative'],
    default: 0
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  trackingUrl: {
    type: String,
    trim: true
  },
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  refundAmount: {
    type: Number,
    min: [0, 'Refund amount cannot be negative'],
    default: 0
  },
  refundReason: String,
  refundedAt: Date,
  paymentDetails: {
    transactionId: String,
    paymentIntentId: String,
    paymentMethodId: String,
    last4: String,
    brand: String,
    expMonth: Number,
    expYear: Number
  },
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: {
    type: String,
    maxlength: [200, 'Gift message cannot exceed 200 characters']
  },
  isGiftWrapped: {
    type: Boolean,
    default: false
  },
  giftWrapCost: {
    type: Number,
    min: [0, 'Gift wrap cost cannot be negative'],
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'shippingAddress.zipCode': 1 });
orderSchema.index({ trackingNumber: 1 });

// Virtual for order summary
orderSchema.virtual('summary').get(function() {
  const itemCount = this.items.reduce((total, item) => total + item.quantity, 0);
  return {
    itemCount,
    totalItems: this.items.length,
    totalValue: this.total,
    status: this.orderStatus
  };
});

// Virtual for is delivered
orderSchema.virtual('isDelivered').get(function() {
  return this.orderStatus === 'delivered';
});

// Virtual for is cancelled
orderSchema.virtual('isCancelled').get(function() {
  return this.orderStatus === 'cancelled';
});

// Virtual for can be cancelled
orderSchema.virtual('canBeCancelled').get(function() {
  return ['pending', 'confirmed', 'processing'].includes(this.orderStatus);
});

// Virtual for can be returned
orderSchema.virtual('canBeReturned').get(function() {
  return this.orderStatus === 'delivered' && 
         this.deliveredAt && 
         (new Date() - this.deliveredAt) <= (30 * 24 * 60 * 60 * 1000); // 30 days
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Pre-save middleware to calculate totals
orderSchema.pre('save', function(next) {
  // Calculate subtotal
  this.subtotal = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Calculate total
  this.total = this.subtotal + this.shippingCost + this.tax - this.discount;

  // Ensure total is not negative
  if (this.total < 0) {
    this.total = 0;
  }

  next();
});

// Instance method to update order status
orderSchema.methods.updateStatus = function(newStatus, notes = '') {
  const validTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered', 'cancelled'],
    delivered: ['returned'],
    cancelled: [],
    returned: []
  };

  if (!validTransitions[this.orderStatus].includes(newStatus)) {
    throw new Error(`Invalid status transition from ${this.orderStatus} to ${newStatus}`);
  }

  this.orderStatus = newStatus;
  
  // Set timestamps for specific statuses
  if (newStatus === 'delivered') {
    this.deliveredAt = new Date();
  } else if (newStatus === 'cancelled') {
    this.cancelledAt = new Date();
  }

  if (notes) {
    this.notes = notes;
  }

  return this.save();
};

// Instance method to cancel order
orderSchema.methods.cancel = function(reason = '') {
  if (!this.canBeCancelled) {
    throw new Error('Order cannot be cancelled in its current status');
  }

  this.orderStatus = 'cancelled';
  this.cancelledAt = new Date();
  this.cancellationReason = reason;

  return this.save();
};

// Instance method to add tracking
orderSchema.methods.addTracking = function(trackingNumber, trackingUrl = '') {
  if (this.orderStatus !== 'shipped') {
    throw new Error('Can only add tracking to shipped orders');
  }

  this.trackingNumber = trackingNumber;
  this.trackingUrl = trackingUrl;

  return this.save();
};

// Static method to find orders by user
orderSchema.statics.findByUser = function(userId, options = {}) {
  const { status, limit = 10, page = 1 } = options;
  
  let query = { user: userId };
  if (status) {
    query.orderStatus = status;
  }

  const skip = (page - 1) * limit;

  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email')
    .populate('items.book', 'title author image');
};

// Static method to find orders by status
orderSchema.statics.findByStatus = function(status, options = {}) {
  const { limit = 50, page = 1 } = options;
  const skip = (page - 1) * limit;

  return this.find({ orderStatus: status })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email phone')
    .populate('items.book', 'title author image');
};

// Static method to get order statistics
orderSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 },
        totalValue: { $sum: '$total' }
      }
    }
  ]);

  const totalOrders = await this.countDocuments();
  const totalRevenue = await this.aggregate([
    { $match: { orderStatus: 'delivered' } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);

  return {
    byStatus: stats,
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0
  };
};

module.exports = mongoose.model('Order', orderSchema);
