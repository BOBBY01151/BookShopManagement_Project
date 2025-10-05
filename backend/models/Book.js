const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    max: [10000, 'Price cannot exceed $10,000']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    max: [10000, 'Stock cannot exceed 10,000']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['books', 'pens', 'toys', 'supplies', 'art', 'backpacks', 'electronics', 'sports'],
      message: 'Category must be one of: books, pens, toys, supplies, art, backpacks, electronics, sports'
    }
  },
  genre: {
    type: String,
    trim: true,
    maxlength: [50, 'Genre cannot exceed 50 characters']
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true, // Allow multiple null values
    trim: true,
    match: [/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/, 'Please enter a valid ISBN']
  },
  image: {
    type: String,
    default: null
  },
  images: [{
    type: String
  }],
  publishedDate: {
    type: Date
  },
  publisher: {
    type: String,
    trim: true,
    maxlength: [100, 'Publisher name cannot exceed 100 characters']
  },
  language: {
    type: String,
    default: 'English',
    trim: true
  },
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'in'],
      default: 'cm'
    }
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  weightUnit: {
    type: String,
    enum: ['g', 'kg', 'lb', 'oz'],
    default: 'g'
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative']
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: true
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  saleStartDate: Date,
  saleEndDate: Date,
  seo: {
    metaTitle: String,
    metaDescription: String,
    slug: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ category: 1 });
bookSchema.index({ price: 1 });
bookSchema.index({ stock: 1 });
bookSchema.index({ isActive: 1 });
bookSchema.index({ isFeatured: 1 });
bookSchema.index({ isNew: 1 });
bookSchema.index({ isOnSale: 1 });
bookSchema.index({ 'rating.average': -1 });
bookSchema.index({ createdAt: -1 });

// Virtual for discount percentage
bookSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for availability status
bookSchema.virtual('availability').get(function() {
  if (this.stock === 0) return 'out-of-stock';
  if (this.stock < 10) return 'low-stock';
  return 'in-stock';
});

// Pre-save middleware to generate slug
bookSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.seo.slug) {
    this.seo.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Instance method to check if book is in stock
bookSchema.methods.isInStock = function() {
  return this.stock > 0;
};

// Instance method to check if book is on sale
bookSchema.methods.isOnSaleNow = function() {
  if (!this.isOnSale) return false;
  const now = new Date();
  return (!this.saleStartDate || now >= this.saleStartDate) &&
         (!this.saleEndDate || now <= this.saleEndDate);
};

// Static method to find featured books
bookSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ isActive: true, isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to find new books
bookSchema.statics.findNew = function(limit = 10) {
  return this.find({ isActive: true, isNew: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to find books on sale
bookSchema.statics.findOnSale = function(limit = 10) {
  const now = new Date();
  return this.find({
    isActive: true,
    isOnSale: true,
    $or: [
      { saleStartDate: { $lte: now } },
      { saleStartDate: { $exists: false } }
    ],
    $or: [
      { saleEndDate: { $gte: now } },
      { saleEndDate: { $exists: false } }
    ]
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to search books
bookSchema.statics.searchBooks = function(query, options = {}) {
  const {
    category,
    minPrice,
    maxPrice,
    inStock,
    sortBy = 'relevance',
    page = 1,
    limit = 12
  } = options;

  let searchQuery = { isActive: true };

  // Text search
  if (query) {
    searchQuery.$text = { $search: query };
  }

  // Category filter
  if (category) {
    searchQuery.category = category;
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    searchQuery.price = {};
    if (minPrice !== undefined) searchQuery.price.$gte = minPrice;
    if (maxPrice !== undefined) searchQuery.price.$lte = maxPrice;
  }

  // Stock filter
  if (inStock) {
    searchQuery.stock = { $gt: 0 };
  }

  // Sort options
  let sort = {};
  switch (sortBy) {
    case 'price-asc':
      sort = { price: 1 };
      break;
    case 'price-desc':
      sort = { price: -1 };
      break;
    case 'name-asc':
      sort = { title: 1 };
      break;
    case 'name-desc':
      sort = { title: -1 };
      break;
    case 'newest':
      sort = { createdAt: -1 };
      break;
    case 'oldest':
      sort = { createdAt: 1 };
      break;
    case 'rating':
      sort = { 'rating.average': -1 };
      break;
    case 'relevance':
    default:
      if (query) {
        sort = { score: { $meta: 'textScore' } };
      } else {
        sort = { createdAt: -1 };
      }
      break;
  }

  const skip = (page - 1) * limit;

  return this.find(searchQuery)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');
};

module.exports = mongoose.model('Book', bookSchema);
