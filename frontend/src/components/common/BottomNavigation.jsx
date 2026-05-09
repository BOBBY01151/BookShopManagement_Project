import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Boxes,
  ShieldCheck,
  Search,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNavigation = () => {
  const location = useLocation();
  const navItems = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Stock', path: '/inventory', icon: Boxes },
    { name: 'Daily', path: '/daily-used', icon: Zap },
    { name: 'Admin', path: '/settings', icon: ShieldCheck },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
      <nav className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[28px] p-2 flex items-center justify-around shadow-2xl shadow-green-900/10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`relative flex-1 py-2 rounded-2xl transition-all duration-300 flex flex-col items-center group ${
                active 
                  ? 'text-[#22c55e]' 
                  : 'text-gray-400 hover:text-[#166534]'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${active ? 'bg-[#dcfce7] shadow-sm scale-110' : 'group-hover:bg-gray-50'}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={`text-[9px] font-black mt-1 uppercase tracking-wider transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-70'}`}>
                {item.name}
              </span>
              {active && (
                <motion.div 
                  layoutId="bottom-nav-indicator"
                  className="absolute -bottom-1 w-1 h-1 bg-[#22c55e] rounded-full" 
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavigation;
