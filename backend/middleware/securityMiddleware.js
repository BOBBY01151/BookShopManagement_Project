const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Security headers
exports.setSecurityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "http://localhost:5000"],
      connectSrc: ["'self'", "http://localhost:5000", "ws://localhost:5174"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http://localhost:5000"],
    },
  },
  crossOriginEmbedderPolicy: false
});

// Rate limiting
exports.createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      status: 'error',
      message: message || 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General rate limiting
exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for development (from 100)
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.'
  }
});

// Authentication rate limiting
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased for development (from 5)
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later.'
  },
  skipSuccessfulRequests: true
});

// API rate limiting
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many API requests, please try again later.'
  }
});

// Data sanitization against NoSQL query injection
exports.sanitizeData = mongoSanitize();

// Data sanitization against XSS
exports.xssProtection = xss();

// Prevent parameter pollution
exports.preventParameterPollution = hpp({
  whitelist: [
    'sort',
    'fields',
    'page',
    'limit',
    'category',
    'price',
    'rating'
  ]
});

// CORS configuration
exports.corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://schoolshop.netlify.app',
    'https://schoolshop.herokuapp.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Request logging middleware
exports.requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };
    
    // Log only errors in production
    if (process.env.NODE_ENV === 'production' && res.statusCode >= 400) {
      console.error('Request Error:', log);
    } else if (process.env.NODE_ENV === 'development') {
      console.log('Request:', log);
    }
  });
  
  next();
};

// IP whitelist middleware
exports.ipWhitelist = (allowedIPs) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (allowedIPs.includes(clientIP)) {
      next();
    } else {
      res.status(403).json({
        status: 'error',
        message: 'Access denied from this IP address'
      });
    }
  };
};

// Admin IP restriction
exports.adminIPRestriction = (req, res, next) => {
  // Only apply to admin routes
  if (req.path.startsWith('/api/users') || req.path.startsWith('/api/orders/stats')) {
    const adminIPs = process.env.ADMIN_IPS ? process.env.ADMIN_IPS.split(',') : [];
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (adminIPs.length > 0 && !adminIPs.includes(clientIP)) {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access restricted to specific IP addresses'
      });
    }
  }
  
  next();
};

// Request size limiter
exports.limitRequestSize = (limit = '10mb') => {
  return (req, res, next) => {
    const contentLength = parseInt(req.get('content-length') || '0');
    const maxSize = parseInt(limit.replace('mb', '')) * 1024 * 1024;
    
    if (contentLength > maxSize) {
      return res.status(413).json({
        status: 'error',
        message: 'Request entity too large'
      });
    }
    
    next();
  };
};

// Security headers for specific routes
exports.setStrictSecurityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
};

// API key validation middleware
exports.validateApiKey = (req, res, next) => {
  const apiKey = req.get('X-API-Key');
  const validApiKey = process.env.API_KEY;
  
  if (!validApiKey) {
    return next(); // Skip if no API key is configured
  }
  
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or missing API key'
    });
  }
  
  next();
};
