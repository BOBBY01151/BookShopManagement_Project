const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Protect routes - verify JWT token
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }

  // 5) Check if user is active
  if (!currentUser.isActive) {
    return next(new AppError('Your account has been deactivated. Please contact support.', 401));
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

// Restrict access to certain roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'staff']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

// Optional authentication - doesn't fail if no token
exports.optionalAuth = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);
      
      if (currentUser && currentUser.isActive && !currentUser.changedPasswordAfter(decoded.iat)) {
        req.user = currentUser;
      }
    } catch (error) {
      // Token is invalid, but we don't throw an error
      // Just continue without setting req.user
    }
  }

  next();
});

// Check if user owns resource or is admin/staff
exports.checkOwnership = (Model, paramName = 'id') => {
  return catchAsync(async (req, res, next) => {
    const resource = await Model.findById(req.params[paramName]);
    
    if (!resource) {
      return next(new AppError('Resource not found', 404));
    }

    // Check if user owns the resource or is admin/staff
    const isOwner = resource.user && resource.user.toString() === req.user.id;
    const isAdminOrStaff = ['admin', 'staff'].includes(req.user.role);

    if (!isOwner && !isAdminOrStaff) {
      return next(new AppError('You can only access your own resources', 403));
    }

    req.resource = resource;
    next();
  });
};

// Rate limiting for authentication routes
exports.authRateLimit = (req, res, next) => {
  // Simple rate limiting - in production, use redis or similar
  const key = `auth_${req.ip}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  if (!req.app.locals.rateLimit) {
    req.app.locals.rateLimit = {};
  }

  const attempts = req.app.locals.rateLimit[key] || { count: 0, resetTime: now + windowMs };

  if (now > attempts.resetTime) {
    attempts.count = 0;
    attempts.resetTime = now + windowMs;
  }

  if (attempts.count >= maxAttempts) {
    return next(new AppError('Too many authentication attempts. Please try again later.', 429));
  }

  attempts.count++;
  req.app.locals.rateLimit[key] = attempts;

  next();
};

// Check if user can access admin features
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new AppError('Admin access required', 403));
  }
  next();
};

// Check if user can access staff features
exports.staffOrAdmin = (req, res, next) => {
  if (!['admin', 'staff'].includes(req.user.role)) {
    return next(new AppError('Staff or admin access required', 403));
  }
  next();
};
