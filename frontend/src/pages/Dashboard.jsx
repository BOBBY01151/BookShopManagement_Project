import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  RefreshCcw,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Server,
  Database
} from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI } from '../api/auth';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const meResponse = await authAPI.getMe();
      if (meResponse.data.status === 'success') {
        setAdminUser(meResponse.data.data.user);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-10"
    >
      {/* Administrator Identity Header */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 shadow-sm overflow-hidden relative"
      >
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-50/50 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 bg-[#166534] rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-green-100">
              {adminUser?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  Welcome back, <span className="text-[#22c55e]">{adminUser?.name || 'Administrator'}</span>
                </h1>
                <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-md tracking-widest">
                  Verified
                </div>
              </div>
              <div className="flex items-center gap-4 mt-1.5">
                <div className="flex items-center gap-1.5 text-gray-500 font-bold text-sm">
                  <DollarSign className="h-4 w-4 text-[#22c55e]" />
                  <span>{adminUser?.email || 'admin@system.local'}</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-gray-300" />
                <div className="flex items-center gap-1.5 text-gray-500 font-bold text-sm uppercase tracking-tighter">
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                  <span>{adminUser?.role || 'Root Access'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-2xl font-bold transition-all border border-gray-100"
             >
               <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
               {refreshing ? 'Syncing...' : 'Sync Data'}
             </button>
             <button className="flex items-center gap-2 bg-[#22c55e] text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-green-100 hover:scale-[1.02] active:scale-[0.98] transition-all">
               System Logs
             </button>
          </div>
        </div>
      </motion.div>

      {/* System Status Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="card p-6 flex items-center space-x-4 bg-white border border-gray-100 shadow-sm rounded-3xl">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
            <Server className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">API Status</p>
            <p className="text-xl font-black text-gray-900">Operational</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6 flex items-center space-x-4 bg-white border border-gray-100 shadow-sm rounded-3xl">
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Database</p>
            <p className="text-xl font-black text-gray-900">Connected</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6 flex items-center space-x-4 bg-white border border-gray-100 shadow-sm rounded-3xl">
          <div className="p-4 bg-purple-50 rounded-2xl text-purple-600">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">System Load</p>
            <p className="text-xl font-black text-gray-900">Normal</p>
          </div>
        </motion.div>
      </div>

      <motion.div 
        variants={itemVariants}
        className="bg-amber-50 border border-amber-200 p-8 rounded-[32px] flex flex-col items-center justify-center text-center space-y-4"
      >
        <div className="p-4 bg-amber-100 rounded-full text-amber-600">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <div>
          <h2 className="text-xl font-black text-amber-900">Auth-Only Mode Active</h2>
          <p className="text-amber-700 max-w-md mx-auto mt-2">
            The system has been cleaned of legacy modules. Inventory, Order, and Employee management features are currently disabled as requested.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
