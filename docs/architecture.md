# BookShop Management System - Architecture Documentation

## System Overview

The BookShop Management System is a full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) designed to manage book inventory, sales, and customer relationships.

## Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React.js)    │◄──►│   (Express.js)  │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • Components    │    │ • Controllers   │    │ • Users         │
│ • Pages         │    │ • Routes        │    │ • Books         │
│ • Contexts      │    │ • Middleware    │    │ • Orders        │
│ • Hooks         │    │ • Models        │    │ • Reviews       │
│ • API Calls     │    │ • Utils         │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend
- **React.js 18** - UI library with hooks and functional components
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management and validation
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and development server
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **multer** - File upload handling

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Nodemon** - Development server auto-restart

## Project Structure

### Backend Structure
```
backend/
├── config/                 # Configuration files
│   ├── database.js        # MongoDB connection
│   └── cloudinary.js      # Image upload service
├── controllers/           # Business logic
│   ├── authController.js  # Authentication logic
│   ├── bookController.js  # Book management
│   ├── orderController.js # Order processing
│   └── userController.js  # User management
├── models/               # Database schemas
│   ├── User.js          # User model
│   ├── Book.js          # Book model
│   ├── Order.js         # Order model
│   └── Review.js        # Review model
├── routes/              # API routes
│   ├── auth.js          # Authentication routes
│   ├── books.js         # Book routes
│   ├── orders.js        # Order routes
│   └── users.js         # User routes
├── middleware/          # Custom middleware
│   ├── auth.js          # JWT authentication
│   ├── errorHandler.js  # Error handling
│   ├── validation.js    # Input validation
│   └── upload.js        # File upload
├── utils/               # Helper functions
│   ├── generateToken.js # JWT token generation
│   ├── sendEmail.js     # Email service
│   └── pagination.js    # Pagination helper
├── server.js            # Main server file
└── package.json         # Dependencies
```

### Frontend Structure
```
frontend/
├── public/              # Static assets
│   ├── index.html      # HTML template
│   ├── favicon.ico     # Site icon
│   └── manifest.json   # PWA manifest
├── src/
│   ├── api/            # API service layer
│   │   ├── auth.js     # Authentication API
│   │   ├── books.js    # Books API
│   │   ├── orders.js   # Orders API
│   │   └── users.js    # Users API
│   ├── components/     # Reusable components
│   │   ├── common/     # Common components
│   │   ├── forms/      # Form components
│   │   └── ui/         # UI components
│   ├── pages/          # Page components
│   │   ├── Home.jsx    # Home page
│   │   ├── Books.jsx   # Books listing
│   │   ├── Cart.jsx    # Shopping cart
│   │   └── Dashboard.jsx # Admin dashboard
│   ├── contexts/       # React contexts
│   │   ├── AuthContext.jsx # Authentication state
│   │   ├── CartContext.jsx # Cart state
│   │   └── ThemeContext.jsx # Theme state
│   ├── hooks/          # Custom hooks
│   │   ├── useAuth.js  # Authentication hook
│   │   ├── useCart.js  # Cart management
│   │   └── useFetch.js # Data fetching
│   ├── utils/          # Utility functions
│   │   ├── constants.js # App constants
│   │   ├── helpers.js  # Helper functions
│   │   └── validation.js # Form validation
│   ├── styles/         # Styling
│   │   ├── index.css   # Global styles
│   │   └── components.css # Component styles
│   ├── App.jsx         # Main app component
│   └── main.jsx        # React entry point
├── package.json        # Dependencies
└── vite.config.js      # Vite configuration
```

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin, staff, customer),
  profile: {
    avatar: String,
    phone: String,
    address: Object
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Book Model
```javascript
{
  _id: ObjectId,
  title: String,
  author: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  genre: String,
  image: String,
  isbn: String,
  publishedDate: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  books: [{
    book: ObjectId (ref: Book),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: String (pending, processing, shipped, delivered, cancelled),
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: String,
  paymentStatus: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Review Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  book: ObjectId (ref: Book),
  rating: Number (1-5),
  comment: String,
  isApproved: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## API Design

### RESTful Endpoints
- **GET** `/api/books` - Retrieve books
- **POST** `/api/books` - Create book
- **PUT** `/api/books/:id` - Update book
- **DELETE** `/api/books/:id` - Delete book

### Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "pagination": {}
}
```

### Error Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Security Architecture

### Authentication Flow
1. User registers/logs in
2. Server validates credentials
3. JWT token generated and sent
4. Client stores token
5. Token sent with subsequent requests
6. Server validates token on protected routes

### Authorization Levels
- **Public**: No authentication required
- **User**: Valid JWT token required
- **Admin**: Admin role required
- **Staff**: Staff or Admin role required

### Security Measures
- Password hashing with bcrypt
- JWT token expiration
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet security headers

## State Management

### Frontend State
- **React Context** for global state (auth, cart, theme)
- **React Query** for server state management
- **Local Storage** for persistent data
- **Component State** for local UI state

### Backend State
- **MongoDB** for persistent data
- **Memory** for session data
- **Redis** (future) for caching

## Deployment Architecture

### Development Environment
```
Local Machine
├── Frontend (localhost:3000)
├── Backend (localhost:5000)
└── MongoDB (localhost:27017)
```

### Production Environment
```
Cloud Infrastructure
├── Frontend (Netlify/Vercel)
├── Backend (Heroku/AWS)
├── Database (MongoDB Atlas)
└── CDN (Cloudinary)
```

## Performance Considerations

### Frontend Optimization
- Code splitting with React.lazy()
- Image optimization
- Bundle size optimization
- Caching strategies
- Lazy loading

### Backend Optimization
- Database indexing
- Query optimization
- Caching with Redis
- Compression middleware
- Rate limiting

### Database Optimization
- Proper indexing
- Aggregation pipelines
- Connection pooling
- Query optimization

## Scalability Considerations

### Horizontal Scaling
- Load balancers
- Multiple server instances
- Database sharding
- CDN distribution

### Vertical Scaling
- Increased server resources
- Database optimization
- Caching layers
- Performance monitoring

## Monitoring and Logging

### Application Monitoring
- Error tracking (Sentry)
- Performance monitoring
- User analytics
- API monitoring

### Logging Strategy
- Structured logging
- Log levels (error, warn, info, debug)
- Centralized logging
- Log rotation

## Future Enhancements

### Planned Features
- Real-time notifications (WebSocket)
- Advanced search and filtering
- Recommendation engine
- Mobile app (React Native)
- Payment integration
- Email notifications
- Advanced analytics dashboard

### Technical Improvements
- Microservices architecture
- GraphQL API
- Docker containerization
- Kubernetes orchestration
- CI/CD pipeline
- Automated testing

## Development Workflow

### Git Workflow
1. Feature branch creation
2. Development and testing
3. Code review
4. Merge to main branch
5. Deployment

### Testing Strategy
- Unit tests (Jest)
- Integration tests
- End-to-end tests
- API testing
- Performance testing

### Code Quality
- ESLint configuration
- Prettier formatting
- Pre-commit hooks
- Code review process
- Documentation standards

