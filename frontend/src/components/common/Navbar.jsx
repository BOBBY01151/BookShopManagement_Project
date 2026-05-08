import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell,
  ChevronDown,
  Settings,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 py-3 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          
          {/* Logo - Mobile Only */}
          <Link to="/" className="lg:hidden flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-[#111827]">
              Admin<span className="text-[#22c55e]">Panel</span>
            </span>
          </Link>

          <div className="hidden lg:block">
            <h2 className="text-lg font-bold text-[#111827] capitalize">
              {location.pathname === '/' ? 'Overview' : location.pathname.split('/').pop()}
            </h2>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 md:space-x-5">
            {/* Notifications */}
            <button className="relative p-2.5 text-gray-400 hover:text-[#22c55e] hover:bg-[#dcfce7] rounded-xl transition-all group">
              <Bell className="h-6 w-6 transition-transform group-hover:rotate-12" />
              <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-[#22c55e] border-2 border-white rounded-full animate-pulse"></span>
            </button>

            {/* Admin Profile */}
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-1 pr-3 hover:bg-gray-50 rounded-2xl transition-all"
              >
                <div className="h-9 w-9 bg-[#dcfce7] text-[#166534] rounded-xl flex items-center justify-center font-bold shadow-inner uppercase">
                  A
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-[#111827] leading-none">Admin User</p>
                  <p className="text-[10px] text-[#6b7280] mt-1 font-medium tracking-wide uppercase">System Access</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 origin-top-right"
                  >
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">System</p>
                    </div>
                    <Link 
                      to="/settings" 
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#dcfce7] hover:text-[#166534] transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
