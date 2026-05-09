import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  BookOpen,
  LayoutDashboard,
  Search,
  LogOut,
  Boxes,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI } from '../../api/auth';

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [adminUser, setAdminUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.data.status === 'success') {
        setAdminUser(response.data.data.user);
      }
    } catch (error) {
      console.error('Failed to fetch sidebar user data');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const navItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Inventory', path: '/inventory', icon: Boxes },
    { name: 'Daily Used', path: '/daily-used', icon: Zap },
    { name: 'Admin Profile', path: '/settings', icon: ShieldCheck },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#166534] border-r border-white/10 p-6 shadow-2xl">
      <div className="flex items-center space-x-3 mb-10 px-2">
        <div className="bg-[#22c55e] p-2.5 rounded-xl shadow-lg shadow-green-900/40">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          Admin<span className="text-[#22c55e]">Panel</span>
        </span>
      </div>

      <form onSubmit={handleSearch} className="mb-8 px-2">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 focus:bg-white/20 transition-all"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-[#22c55e] transition-colors" />
        </div>
      </form>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={active ? 'sidebar-item sidebar-item-active group' : 'sidebar-item group'}
            >
              <Icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110`} />
              <span>{item.name}</span>
              {active && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-6 rounded-full bg-white/50" 
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-[#22c55e] rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-green-900/40">
            {adminUser?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{adminUser?.name || 'Admin User'}</p>
            <p className="text-[10px] text-gray-400 truncate uppercase font-black tracking-widest">{adminUser?.role || 'Accessing...'}</p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="w-full mt-4 flex items-center space-x-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-bold">Logout System</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
