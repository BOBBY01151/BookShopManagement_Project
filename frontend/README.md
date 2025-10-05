# BookShop Management - Frontend

This is the frontend application for the BookShop Management System built with React.js and Vite.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd BookShopManagement_Project/frontend
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

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── public/             # Static assets
├── src/
│   ├── api/            # API call functions
│   ├── assets/         # Images, logos, icons
│   ├── components/     # Reusable components
│   ├── pages/          # Page-level components
│   ├── contexts/       # React Contexts
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Helper functions
│   ├── styles/         # CSS/Tailwind styles
│   ├── router/         # React Router configuration
│   ├── App.jsx         # Main app component
│   └── main.jsx        # React entry point
├── package.json
└── README.md
```

## 🎨 Features

### Pages
- **Home** - Landing page with featured books
- **Books** - Book catalog with search and filters
- **Book Details** - Individual book information
- **Cart** - Shopping cart management
- **Checkout** - Order placement
- **Login/Register** - User authentication
- **Profile** - User profile management
- **Dashboard** - Admin dashboard (Admin only)
- **Orders** - Order history and tracking

### Components
- **Navbar** - Navigation with user menu
- **Footer** - Site footer with links
- **BookCard** - Book display component
- **SearchBar** - Book search functionality
- **CartItem** - Individual cart item
- **LoadingSpinner** - Loading states
- **ErrorBoundary** - Error handling
- **ProtectedRoute** - Route protection

### Contexts
- **AuthContext** - User authentication state
- **CartContext** - Shopping cart state
- **ThemeContext** - Dark/light theme

### Hooks
- **useAuth** - Authentication hook
- **useCart** - Cart management hook
- **useFetch** - Data fetching hook
- **useLocalStorage** - Local storage hook

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Styling

This project uses **Tailwind CSS** for styling with:
- Responsive design
- Dark/light theme support
- Custom component styles
- Utility-first approach

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=BookShop Management
VITE_APP_VERSION=1.0.0
```

### Vite Configuration
The project uses Vite for fast development and building:
- Hot Module Replacement (HMR)
- Fast builds
- Modern ES modules
- Plugin ecosystem

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Authentication

- JWT-based authentication
- Protected routes
- Role-based access control
- Automatic token refresh
- Secure logout

## 🛒 Shopping Cart

- Add/remove items
- Quantity management
- Persistent storage
- Price calculations
- Checkout process

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Build the project
2. Upload the `dist` folder to Netlify
3. Configure environment variables

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📦 Dependencies

### Core
- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Query** - Data fetching and caching

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

### Forms & Validation
- **React Hook Form** - Form management
- **Custom validation** - Form validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

