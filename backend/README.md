# SchoolShop Backend API

A comprehensive backend API for SchoolShop Management System built with Node.js, Express.js, and MongoDB. This API handles school supplies, books, pens, toys, and other educational products.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: CRUD operations for books, school supplies, toys, etc.
- **Order Management**: Complete order processing with status tracking
- **User Management**: User profiles, roles, and permissions
- **Review System**: Product reviews with ratings and moderation
- **File Upload**: Image upload with Cloudinary integration
- **Email Services**: Email verification, password reset, notifications
- **Security**: Rate limiting, data sanitization, CORS protection
- **Search & Filtering**: Advanced product search with multiple filters
- **Analytics**: Order statistics, user analytics, product insights

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd schoolshop-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/schoolshop
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
backend/
├── config/                 # Configuration files
│   ├── database.js         # MongoDB connection
│   ├── cloudinary.js       # Cloudinary configuration
│   ├── email.js           # Email configuration
│   ├── passport.js        # Passport configuration
│   └── cors.js            # CORS configuration
├── controllers/           # Route controllers
│   ├── authController.js  # Authentication logic
│   ├── bookController.js  # Product management
│   ├── orderController.js # Order processing
│   ├── userController.js  # User management
│   └── reviewController.js # Review system
├── middleware/            # Custom middleware
│   ├── authMiddleware.js  # Authentication middleware
│   ├── errorMiddleware.js # Error handling
│   ├── validationMiddleware.js # Input validation
│   └── securityMiddleware.js # Security features
├── models/               # MongoDB models
│   ├── User.js          # User schema
│   ├── Book.js          # Product schema
│   ├── Order.js         # Order schema
│   └── Review.js        # Review schema
├── routes/              # API routes
│   ├── authRoutes.js    # Authentication routes
│   ├── bookRoutes.js    # Product routes
│   ├── orderRoutes.js   # Order routes
│   ├── userRoutes.js    # User routes
│   ├── reviewRoutes.js  # Review routes
│   └── index.js         # Route aggregator
├── utils/               # Utility functions
│   ├── catchAsync.js    # Async error handler
│   ├── appError.js      # Custom error class
│   ├── sendEmail.js     # Email utilities
│   ├── apiFeatures.js   # Query features
│   ├── helpers.js       # Helper functions
│   └── constants.js     # Application constants
├── scripts/             # Database scripts
│   ├── seedBooks.js     # Seed sample data
│   └── resetDB.js       # Reset database
├── uploads/             # File uploads
├── server.js            # Main server file
├── package.json         # Dependencies
└── README.md           # Documentation
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/update-me` - Update profile
- `PATCH /api/auth/update-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password
- `PATCH /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email

### Products (Books/Supplies)
- `GET /api/books` - Get all products
- `GET /api/books/:id` - Get single product
- `POST /api/books` - Create product (Admin/Staff)
- `PATCH /api/books/:id` - Update product (Admin/Staff)
- `DELETE /api/books/:id` - Delete product (Admin/Staff)
- `GET /api/books/search` - Search products
- `GET /api/books/featured` - Get featured products
- `GET /api/books/new` - Get new products
- `GET /api/books/sale` - Get products on sale
- `GET /api/books/category/:category` - Get products by category

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update order status (Admin/Staff)
- `PATCH /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/stats/overview` - Get order statistics (Admin/Staff)

### Users
- `GET /api/users` - Get all users (Admin/Staff)
- `GET /api/users/:id` - Get single user (Admin/Staff)
- `POST /api/users` - Create user (Admin/Staff)
- `PATCH /api/users/:id` - Update user (Admin/Staff)
- `DELETE /api/users/:id` - Delete user (Admin)
- `GET /api/users/profile/:id` - Get user profile
- `PATCH /api/users/:id/role` - Update user role (Admin)
- `GET /api/users/stats/overview` - Get user statistics (Admin/Staff)

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get single review
- `PATCH /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `PATCH /api/reviews/:id/helpful` - Mark review as helpful
- `PATCH /api/reviews/:id/report` - Report review
- `GET /api/reviews/book/:bookId` - Get book reviews

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

- **Admin**: Full access to all features
- **Staff**: Access to product and order management
- **Customer**: Access to personal features (orders, reviews, profile)

## 🛡️ Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **Data Sanitization**: Protects against NoSQL injection and XSS
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for Express.js
- **Input Validation**: Comprehensive request validation
- **Password Hashing**: Bcrypt for secure password storage

## 📊 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/staff/customer),
  phone: String,
  address: Object,
  avatar: String,
  isActive: Boolean,
  emailVerified: Boolean,
  preferences: Object
}
```

### Book Model (Products)
```javascript
{
  title: String,
  author: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  genre: String,
  isbn: String,
  image: String,
  images: [String],
  rating: Object,
  tags: [String],
  isActive: Boolean,
  isFeatured: Boolean,
  isNew: Boolean,
  isOnSale: Boolean
}
```

### Order Model
```javascript
{
  orderNumber: String (unique),
  user: ObjectId (ref: User),
  items: [Object],
  shippingAddress: Object,
  paymentMethod: String,
  paymentStatus: String,
  orderStatus: String,
  subtotal: Number,
  shippingCost: Number,
  tax: Number,
  total: Number,
  trackingNumber: String
}
```

### Review Model
```javascript
{
  user: ObjectId (ref: User),
  book: ObjectId (ref: Book),
  order: ObjectId (ref: Order),
  rating: Number (1-5),
  title: String,
  comment: String,
  isVerified: Boolean,
  isHelpful: Object,
  isApproved: Boolean,
  images: [String],
  tags: [String]
}
```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/schoolshop
JWT_SECRET=your-production-jwt-secret
EMAIL_USERNAME=your-production-email
EMAIL_PASSWORD=your-production-email-password
CLOUDINARY_CLOUD_NAME=your-production-cloudinary-name
CLOUDINARY_API_KEY=your-production-cloudinary-key
CLOUDINARY_API_SECRET=your-production-cloudinary-secret
```

### Heroku Deployment

1. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   # ... other environment variables
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server
npm start           # Start production server

# Database
npm run seed        # Seed sample data
npm run reset       # Reset database

# Code Quality
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint errors
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@schoolshop.com or create an issue in the repository.

## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - Authentication system
  - Product management
  - Order processing
  - Review system
  - User management
  - Security features

## 📞 Contact

- **Email**: contact@schoolshop.com
- **Website**: https://schoolshop.com
- **GitHub**: https://github.com/schoolshop/backend

---

Made with ❤️ for school children and their educational needs.