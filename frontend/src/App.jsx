import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext'

// Components
import Navbar from './components/common/Navbar'
import Sidebar from './components/common/Sidebar'
import BottomNavigation from './components/common/BottomNavigation'
import ErrorBoundary from './components/common/ErrorBoundary'
import Notification from './components/Notification'

// Pages
import Inventory from './pages/Inventory'
import DailyUsed from './pages/DailyUsed'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppContent />
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

function AppContent() {
  return <LayoutWrapper />;
}


function LayoutWrapper() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Notification />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8 scroll-smooth">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/daily-used" element={<DailyUsed />} />
              <Route path="/settings" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
      <Notification />
    </div>
  );
}

export default App

