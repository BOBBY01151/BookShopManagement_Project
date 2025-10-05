// Application constants
const APP_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  
  // File upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  
  // Rate limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  AUTH_RATE_LIMIT_MAX: 5,
  
  // JWT
  JWT_EXPIRES_IN: '7d',
  JWT_REFRESH_EXPIRES_IN: '30d',
  
  // Email
  EMAIL_VERIFICATION_EXPIRES: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_RESET_EXPIRES: 10 * 60 * 1000, // 10 minutes
  
  // Order
  FREE_SHIPPING_THRESHOLD: 50,
  DEFAULT_SHIPPING_COST: 9.99,
  TAX_RATE: 0.08, // 8%
  
  // Review
  MAX_REVIEW_IMAGES: 5,
  MAX_REVIEW_TAGS: 6,
  
  // Search
  MAX_SEARCH_RESULTS: 100,
  SEARCH_DEBOUNCE_DELAY: 300,
  
  // Cache
  CACHE_TTL: 300, // 5 minutes
  CACHE_MAX_AGE: 3600, // 1 hour
};

// Product categories
const PRODUCT_CATEGORIES = [
  { value: 'books', label: 'Books', icon: '📚' },
  { value: 'pens', label: 'Pens & Stationery', icon: '✏️' },
  { value: 'toys', label: 'Toys & Games', icon: '🧸' },
  { value: 'supplies', label: 'School Supplies', icon: '📝' },
  { value: 'art', label: 'Art & Craft', icon: '🎨' },
  { value: 'backpacks', label: 'Backpacks', icon: '🎒' },
  { value: 'electronics', label: 'Electronics', icon: '💻' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
];

// Order status
const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
};

const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.CONFIRMED]: 'Confirmed',
  [ORDER_STATUS.PROCESSING]: 'Processing',
  [ORDER_STATUS.SHIPPED]: 'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
  [ORDER_STATUS.RETURNED]: 'Returned',
};

const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'yellow',
  [ORDER_STATUS.CONFIRMED]: 'blue',
  [ORDER_STATUS.PROCESSING]: 'orange',
  [ORDER_STATUS.SHIPPED]: 'purple',
  [ORDER_STATUS.DELIVERED]: 'green',
  [ORDER_STATUS.CANCELLED]: 'red',
  [ORDER_STATUS.RETURNED]: 'gray',
};

// Payment status
const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
};

const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'Pending',
  [PAYMENT_STATUS.PAID]: 'Paid',
  [PAYMENT_STATUS.FAILED]: 'Failed',
  [PAYMENT_STATUS.REFUNDED]: 'Refunded',
  [PAYMENT_STATUS.PARTIALLY_REFUNDED]: 'Partially Refunded',
};

// User roles
const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  CUSTOMER: 'customer',
};

const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.STAFF]: 'Staff',
  [USER_ROLES.CUSTOMER]: 'Customer',
};

// Payment methods
const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
  CASH_ON_DELIVERY: 'cash_on_delivery',
};

const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CREDIT_CARD]: 'Credit Card',
  [PAYMENT_METHODS.DEBIT_CARD]: 'Debit Card',
  [PAYMENT_METHODS.PAYPAL]: 'PayPal',
  [PAYMENT_METHODS.STRIPE]: 'Stripe',
  [PAYMENT_METHODS.CASH_ON_DELIVERY]: 'Cash on Delivery',
};

// Sort options
const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  PRICE_ASC: 'price-asc',
  PRICE_DESC: 'price-desc',
  NAME_ASC: 'name-asc',
  NAME_DESC: 'name-desc',
  RATING: 'rating',
  RELEVANCE: 'relevance',
};

const SORT_OPTION_LABELS = {
  [SORT_OPTIONS.NEWEST]: 'Newest First',
  [SORT_OPTIONS.OLDEST]: 'Oldest First',
  [SORT_OPTIONS.PRICE_ASC]: 'Price: Low to High',
  [SORT_OPTIONS.PRICE_DESC]: 'Price: High to Low',
  [SORT_OPTIONS.NAME_ASC]: 'Name: A to Z',
  [SORT_OPTIONS.NAME_DESC]: 'Name: Z to A',
  [SORT_OPTIONS.RATING]: 'Highest Rated',
  [SORT_OPTIONS.RELEVANCE]: 'Most Relevant',
};

// Review tags
const REVIEW_TAGS = {
  QUALITY: 'quality',
  VALUE: 'value',
  SHIPPING: 'shipping',
  PACKAGING: 'packaging',
  CUSTOMER_SERVICE: 'customer_service',
  RECOMMEND: 'recommend',
};

const REVIEW_TAG_LABELS = {
  [REVIEW_TAGS.QUALITY]: 'Quality',
  [REVIEW_TAGS.VALUE]: 'Value',
  [REVIEW_TAGS.SHIPPING]: 'Shipping',
  [REVIEW_TAGS.PACKAGING]: 'Packaging',
  [REVIEW_TAGS.CUSTOMER_SERVICE]: 'Customer Service',
  [REVIEW_TAGS.RECOMMEND]: 'Recommend',
};

// Error messages
const ERROR_MESSAGES = {
  // Authentication
  UNAUTHORIZED: 'You are not authorized to access this resource',
  FORBIDDEN: 'You do not have permission to perform this action',
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again',
  ACCOUNT_DEACTIVATED: 'Your account has been deactivated',
  
  // Validation
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please provide a valid email address',
  INVALID_PHONE: 'Please provide a valid phone number',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  
  // Resources
  NOT_FOUND: 'Resource not found',
  ALREADY_EXISTS: 'Resource already exists',
  INSUFFICIENT_STOCK: 'Insufficient stock available',
  OUT_OF_STOCK: 'This item is out of stock',
  
  // Orders
  ORDER_NOT_FOUND: 'Order not found',
  ORDER_CANNOT_BE_CANCELLED: 'Order cannot be cancelled in its current status',
  ORDER_ALREADY_CANCELLED: 'Order has already been cancelled',
  
  // Reviews
  REVIEW_NOT_FOUND: 'Review not found',
  ALREADY_REVIEWED: 'You have already reviewed this item',
  CANNOT_REVIEW: 'You can only review items you have purchased',
  
  // General
  INTERNAL_SERVER_ERROR: 'Something went wrong on our end',
  BAD_REQUEST: 'Invalid request data',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit',
  INVALID_FILE_TYPE: 'Invalid file type',
};

// Success messages
const SUCCESS_MESSAGES = {
  // Authentication
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  REGISTER_SUCCESS: 'Account created successfully',
  PASSWORD_UPDATED: 'Password updated successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
  PASSWORD_RESET_SENT: 'Password reset email sent',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully',
  
  // Profile
  PROFILE_UPDATED: 'Profile updated successfully',
  ACCOUNT_DELETED: 'Account deleted successfully',
  
  // Orders
  ORDER_CREATED: 'Order created successfully',
  ORDER_UPDATED: 'Order updated successfully',
  ORDER_CANCELLED: 'Order cancelled successfully',
  
  // Reviews
  REVIEW_CREATED: 'Review created successfully',
  REVIEW_UPDATED: 'Review updated successfully',
  REVIEW_DELETED: 'Review deleted successfully',
  
  // General
  OPERATION_SUCCESS: 'Operation completed successfully',
  DATA_EXPORTED: 'Data exported successfully',
  BULK_UPDATE_SUCCESS: 'Bulk update completed successfully',
};

// API response status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

module.exports = {
  APP_CONSTANTS,
  PRODUCT_CATEGORIES,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS,
  PAYMENT_STATUS_LABELS,
  USER_ROLES,
  USER_ROLE_LABELS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  SORT_OPTIONS,
  SORT_OPTION_LABELS,
  REVIEW_TAGS,
  REVIEW_TAG_LABELS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  HTTP_STATUS,
};
