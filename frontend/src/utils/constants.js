// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'SchoolShop',
  VERSION: '1.0.0',
  DESCRIPTION: 'Your one-stop shop for school supplies',
  SUPPORT_EMAIL: 'support@schoolshop.com',
  PHONE: '+1 (555) 123-4567',
  ADDRESS: '123 Education Street, Learning City, LC 12345',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  CUSTOMER: 'customer',
};

// Product Categories
export const PRODUCT_CATEGORIES = [
  { value: 'books', label: 'Books', icon: '📚' },
  { value: 'pens', label: 'Pens & Pencils', icon: '✏️' },
  { value: 'toys', label: 'Toys', icon: '🧸' },
  { value: 'supplies', label: 'School Supplies', icon: '📝' },
  { value: 'art', label: 'Art & Craft', icon: '🎨' },
  { value: 'backpacks', label: 'Backpacks', icon: '🎒' },
  { value: 'electronics', label: 'Electronics', icon: '💻' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
];

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

// Order Status Labels
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.PROCESSING]: 'Processing',
  [ORDER_STATUS.SHIPPED]: 'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
  [ORDER_STATUS.REFUNDED]: 'Refunded',
};

// Order Status Colors
export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ORDER_STATUS.PROCESSING]: 'bg-blue-100 text-blue-800',
  [ORDER_STATUS.SHIPPED]: 'bg-purple-100 text-purple-800',
  [ORDER_STATUS.DELIVERED]: 'bg-green-100 text-green-800',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
  [ORDER_STATUS.REFUNDED]: 'bg-gray-100 text-gray-800',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  CASH_ON_DELIVERY: 'cash_on_delivery',
  BANK_TRANSFER: 'bank_transfer',
};

// Payment Method Labels
export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CREDIT_CARD]: 'Credit Card',
  [PAYMENT_METHODS.DEBIT_CARD]: 'Debit Card',
  [PAYMENT_METHODS.PAYPAL]: 'PayPal',
  [PAYMENT_METHODS.CASH_ON_DELIVERY]: 'Cash on Delivery',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Bank Transfer',
};

// Sort Options
export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZES: [12, 24, 48, 96],
  MAX_PAGE_SIZE: 100,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
};

// Validation Rules
export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  EMAIL: {
    MAX_LENGTH: 100,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },
  ADDRESS: {
    MAX_LENGTH: 200,
  },
  DESCRIPTION: {
    MAX_LENGTH: 1000,
  },
  TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  PRICE: {
    MIN: 0,
    MAX: 10000,
  },
  STOCK: {
    MIN: 0,
    MAX: 10000,
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recent_searches',
  WISHLIST: 'wishlist',
};

// Toast Messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful!',
    REGISTER: 'Registration successful!',
    LOGOUT: 'Logged out successfully!',
    PROFILE_UPDATE: 'Profile updated successfully!',
    PASSWORD_CHANGE: 'Password changed successfully!',
    PRODUCT_ADD: 'Product added successfully!',
    PRODUCT_UPDATE: 'Product updated successfully!',
    PRODUCT_DELETE: 'Product deleted successfully!',
    ORDER_CREATE: 'Order created successfully!',
    ORDER_UPDATE: 'Order updated successfully!',
    CART_ADD: 'Item added to cart!',
    CART_REMOVE: 'Item removed from cart!',
    CART_CLEAR: 'Cart cleared!',
    WISHLIST_ADD: 'Added to wishlist!',
    WISHLIST_REMOVE: 'Removed from wishlist!',
  },
  ERROR: {
    LOGIN: 'Login failed. Please try again.',
    REGISTER: 'Registration failed. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'Resource not found.',
    VALIDATION: 'Please check your input and try again.',
    FILE_UPLOAD: 'File upload failed. Please try again.',
    GENERIC: 'Something went wrong. Please try again.',
  },
  INFO: {
    LOADING: 'Loading...',
    SAVING: 'Saving...',
    UPLOADING: 'Uploading...',
    PROCESSING: 'Processing...',
  },
};

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/schoolshop',
  TWITTER: 'https://twitter.com/schoolshop',
  INSTAGRAM: 'https://instagram.com/schoolshop',
  YOUTUBE: 'https://youtube.com/schoolshop',
  LINKEDIN: 'https://linkedin.com/company/schoolshop',
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_WISHLIST: true,
  ENABLE_REVIEWS: true,
  ENABLE_RECOMMENDATIONS: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_MULTI_LANGUAGE: false,
  ENABLE_PAYMENT_INTEGRATION: false,
  ENABLE_SOCIAL_LOGIN: false,
};

// Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

// Z-Index Values
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
};

// Color Palette
export const COLORS = {
  PRIMARY: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  SECONDARY: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  SUCCESS: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  WARNING: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  ERROR: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
};

// Default Values
export const DEFAULTS = {
  AVATAR: '/images/default-avatar.png',
  PRODUCT_IMAGE: '/images/default-product.png',
  COMPANY_LOGO: '/images/logo.png',
  FAVICON: '/favicon.ico',
  META_IMAGE: '/images/meta-image.png',
  CURRENCY: 'USD',
  LOCALE: 'en-US',
  TIMEZONE: 'America/New_York',
  DATE_FORMAT: 'MM/DD/YYYY',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'MM/DD/YYYY HH:mm',
};
