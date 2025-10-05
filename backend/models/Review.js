const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isHelpful: {
    count: {
      type: Number,
      default: 0,
      min: [0, 'Helpful count cannot be negative']
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  isReported: {
    count: {
      type: Number,
      default: 0,
      min: [0, 'Report count cannot be negative']
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    reasons: [{
      type: String,
      enum: ['spam', 'inappropriate', 'fake', 'offensive', 'irrelevant']
    }]
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Image must be a valid image file'
    }
  }],
  tags: [{
    type: String,
    enum: ['quality', 'value', 'shipping', 'packaging', 'customer_service', 'recommend']
  }],
  response: {
    text: {
      type: String,
      maxlength: [500, 'Response cannot exceed 500 characters']
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to ensure one review per user per book per order
reviewSchema.index({ user: 1, book: 1, order: 1 }, { unique: true });

// Indexes for better performance
reviewSchema.index({ book: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ 'isHelpful.count': -1 });

// Virtual for helpful percentage
reviewSchema.virtual('helpfulPercentage').get(function() {
  if (this.isHelpful.count === 0) return 0;
  // This would need to be calculated based on total votes
  return Math.round((this.isHelpful.count / (this.isHelpful.count + this.isReported.count)) * 100);
});

// Virtual for is recent
reviewSchema.virtual('isRecent').get(function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return this.createdAt > thirtyDaysAgo;
});

// Pre-save middleware to update book rating
reviewSchema.post('save', async function() {
  if (this.isApproved) {
    await this.constructor.updateBookRating(this.book);
  }
});

// Pre-remove middleware to update book rating
reviewSchema.post('remove', async function() {
  await this.constructor.updateBookRating(this.book);
});

// Static method to update book rating
reviewSchema.statics.updateBookRating = async function(bookId) {
  const stats = await this.aggregate([
    { $match: { book: bookId, isApproved: true } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    const { averageRating, totalReviews } = stats[0];
    await mongoose.model('Book').findByIdAndUpdate(bookId, {
      'rating.average': Math.round(averageRating * 10) / 10, // Round to 1 decimal
      'rating.count': totalReviews
    });
  } else {
    // No approved reviews, reset rating
    await mongoose.model('Book').findByIdAndUpdate(bookId, {
      'rating.average': 0,
      'rating.count': 0
    });
  }
};

// Instance method to mark as helpful
reviewSchema.methods.markHelpful = function(userId) {
  if (this.isHelpful.users.includes(userId)) {
    // Remove helpful vote
    this.isHelpful.users.pull(userId);
    this.isHelpful.count = Math.max(0, this.isHelpful.count - 1);
  } else {
    // Add helpful vote
    this.isHelpful.users.push(userId);
    this.isHelpful.count += 1;
    
    // Remove from reported if user had reported it
    if (this.isReported.users.includes(userId)) {
      this.isReported.users.pull(userId);
      this.isReported.count = Math.max(0, this.isReported.count - 1);
    }
  }
  
  return this.save();
};

// Instance method to report review
reviewSchema.methods.report = function(userId, reason) {
  if (this.isReported.users.includes(userId)) {
    throw new Error('User has already reported this review');
  }
  
  this.isReported.users.push(userId);
  this.isReported.count += 1;
  this.isReported.reasons.push(reason);
  
  // Remove from helpful if user had marked it helpful
  if (this.isHelpful.users.includes(userId)) {
    this.isHelpful.users.pull(userId);
    this.isHelpful.count = Math.max(0, this.isHelpful.count - 1);
  }
  
  return this.save();
};

// Instance method to add response
reviewSchema.methods.addResponse = function(text, respondedBy) {
  this.response = {
    text,
    respondedBy,
    respondedAt: new Date()
  };
  
  return this.save();
};

// Static method to find reviews by book
reviewSchema.statics.findByBook = function(bookId, options = {}) {
  const { 
    approved = true, 
    sortBy = 'newest', 
    limit = 10, 
    page = 1,
    minRating = 1,
    maxRating = 5
  } = options;
  
  let query = { book: bookId };
  
  if (approved) {
    query.isApproved = true;
  }
  
  if (minRating || maxRating) {
    query.rating = {};
    if (minRating) query.rating.$gte = minRating;
    if (maxRating) query.rating.$lte = maxRating;
  }
  
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
  
  return this.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('user', 'name avatar')
    .populate('response.respondedBy', 'name');
};

// Static method to find reviews by user
reviewSchema.statics.findByUser = function(userId, options = {}) {
  const { approved = true, limit = 10, page = 1 } = options;
  
  let query = { user: userId };
  if (approved) {
    query.isApproved = true;
  }
  
  const skip = (page - 1) * limit;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('book', 'title author image')
    .populate('order', 'orderNumber');
};

// Static method to get review statistics
reviewSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } }
  ]);
  
  const totalReviews = await this.countDocuments({ isApproved: true });
  const averageRating = await this.aggregate([
    { $match: { isApproved: true } },
    { $group: { _id: null, average: { $avg: '$rating' } } }
  ]);
  
  return {
    ratingDistribution: stats,
    totalReviews,
    averageRating: averageRating[0]?.average || 0
  };
};

module.exports = mongoose.model('Review', reviewSchema);
