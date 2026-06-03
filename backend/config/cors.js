const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      // Local development
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      // Production frontend URL from environment variable
      process.env.FRONTEND_URL,
    ].filter(Boolean); // Remove undefined/null entries

    // Also allow any *.vercel.app subdomain dynamically
    const isVercelApp = /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(origin);

    if (allowedOrigins.includes(origin) || isVercelApp) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key'
  ]
};

module.exports = corsOptions;

