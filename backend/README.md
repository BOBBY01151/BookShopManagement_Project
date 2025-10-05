# BookShop Management - Backend API

This is the backend API for the BookShop Management System built with Node.js, Express.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BookShopManagement_Project/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📁 Project Structure

```
backend/
├── config/             # Database connection & environment setup
├── controllers/        # Business logic for routes
├── models/             # Mongoose schemas
├── routes/             # Express routes
├── middleware/         # Custom middleware
├── utils/              # Helper functions
├── server.js           # Main server file
├── .env.example        # Environment variables template
└── package.json        # Dependencies and scripts
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Books
- `GET /api/books` - Get all books (with pagination)
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book (Admin only)
- `PUT /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order status (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

## 🛠️ Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run seed` - Seed database with sample data
- `npm run reset` - Reset database

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Rate limiting
- CORS configuration
- Helmet for security headers

## 📊 Database Models

### User
- name, email, password
- role (admin, staff, customer)
- profile information
- timestamps

### Book
- title, author, description
- price, stock quantity
- category, genre
- image URL
- timestamps

### Order
- user reference
- books array with quantities
- total amount
- status (pending, processing, shipped, delivered)
- shipping address
- timestamps

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 🚀 Deployment

### Environment Variables
Make sure to set the following environment variables in production:

- `NODE_ENV=production`
- `MONGODB_URI=your_production_mongodb_uri`
- `JWT_SECRET=your_secure_jwt_secret`
- `PORT=your_port`

### Heroku Deployment
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-bookshop-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_production_mongodb_uri
heroku config:set JWT_SECRET=your_secure_jwt_secret

# Deploy
git push heroku main
```

## 📝 API Documentation

For detailed API documentation, see the `/docs` folder in the root directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

