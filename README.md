# 📚 BookShop Management System

A comprehensive MERN stack web application for managing book inventory, sales, and customer relationships in a modern bookshop environment.

## 🚀 Tech Stack

- **Frontend**: React.js with modern UI components
- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS3 with responsive design
- **State Management**: React Context API / Redux
- **API**: RESTful API design

## ✨ Features

### 📖 Book Management
- Add, edit, delete, and view book details
- Book inventory tracking
- Category and genre management
- Search and filter functionality
- Book availability status

### 👥 User Management
- User registration and authentication
- Role-based access control (Admin, Staff, Customer)
- User profile management
- Password reset functionality

### 🛒 Sales & Orders
- Shopping cart functionality
- Order processing and tracking
- Sales analytics and reporting
- Payment integration ready

### 📊 Dashboard & Analytics
- Sales overview and statistics
- Inventory reports
- Customer insights
- Revenue tracking

### 🔧 Admin Features
- User management
- System settings
- Backup and restore
- Audit logs

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your configuration
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# PORT=5000

# Start the server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

## 📁 Project Structure

```
BookShopManagement_Project/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── utils/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   └── public/
├── docs/
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookshop
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=BookShop Management
```

## 🚀 Available Scripts

### Backend
```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run test         # Run tests
npm run build        # Build for production
```

### Frontend
```bash
npm start            # Start development server
npm run build        # Build for production
npm test             # Run tests
npm run eject        # Eject from Create React App
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `GET /api/orders/user/:userId` - Get user orders

## 🎨 UI/UX Features

- Responsive design for all devices
- Modern and intuitive interface
- Dark/Light theme support
- Real-time notifications
- Loading states and error handling
- Form validation and feedback

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- SQL injection prevention

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test

# Run all tests
npm run test:all
```

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-bookshop-api

# Set environment variables
heroku config:set MONGODB_URI=your_production_mongodb_uri
heroku config:set JWT_SECRET=your_production_jwt_secret

# Deploy
git push heroku main
```

### Frontend Deployment (Netlify)
```bash
# Build the project
npm run build

# Deploy to Netlify
# Upload the build folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped improve this project
- Special thanks to the MERN stack community
- Inspiration from modern e-commerce platforms

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with basic CRUD operations
- **v1.1.0** - Added authentication and user management
- **v1.2.0** - Implemented shopping cart and order management
- **v1.3.0** - Added dashboard and analytics features

---

⭐ **Star this repository if you found it helpful!**
