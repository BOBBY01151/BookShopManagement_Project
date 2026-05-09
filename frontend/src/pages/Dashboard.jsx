import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  RefreshCcw,
  ShieldCheck,
  Package,
  TrendingUp,
  AlertTriangle,
  LayoutGrid,
  ChevronRight,
  TrendingDown,
  Activity,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../api/auth';
import { productsAPI } from '../api/products';
import { toast } from 'react-hot-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';

const Dashboard = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const [systemLogs, setSystemLogs] = useState([
    { id: 1, type: 'success', message: 'MongoDB Cluster Connected', time: 'Just now' },
    { id: 2, type: 'info', message: 'SKU Index Drop Command Executed', time: '2 mins ago' },
    { id: 3, type: 'success', message: 'Inventory Analytics Rebuilt', time: '5 mins ago' },
    { id: 4, type: 'warning', message: 'High memory usage detected in Node.js', time: '12 mins ago' }
  ]);

  const fetchData = async () => {
    try {
      const [meRes, statsRes] = await Promise.all([
        authAPI.getMe(),
        productsAPI.getStats()
      ]);

      if (meRes.data.status === 'success') {
        setAdminUser(meRes.data.data.user);
      }

      if (statsRes.data.status === 'success') {
        setStats(statsRes.data.data.stats);
      }
    } catch (error) {
      toast.error('Failed to load system analytics');
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

  const Skeleton = ({ className }) => (
    <div className={`relative overflow-hidden bg-gray-100 rounded-[32px] ${className}`}>
      <motion.div 
        animate={{ x: ['-100%', '100%'] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/2 h-full -skew-x-12"
      />
    </div>
  );

  if (loading && !stats) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-80" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-14 w-40 rounded-2xl" />
            <Skeleton className="h-14 w-40 rounded-2xl" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-36 w-full" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-[450px] w-full rounded-[40px]" />
          <Skeleton className="h-[450px] w-full rounded-[40px]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-72 w-full rounded-[40px]" />
          <Skeleton className="h-72 w-full rounded-[40px]" />
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 0
    }).format(value).replace('LKR', 'Rs.');
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const chartColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

  const summaryData = stats?.summary || { totalValue: 0, totalStock: 0, totalProducts: 0, averagePrice: 0 };
  const lowStockCount = stats?.lowStock?.[0]?.count || 0;
  const categoryData = stats?.categories || [];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      {/* Premium Header */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 shadow-sm overflow-hidden relative group"
      >
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-50/50 to-transparent pointer-events-none group-hover:from-emerald-100/50 transition-all duration-700" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="relative group/avatar">
              <div className="h-20 w-20 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[24px] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-emerald-200 ring-4 ring-white">
                {adminUser?.name?.charAt(0) || 'A'}
              </div>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  Hi, <span className="text-emerald-600">{adminUser?.name?.split(' ')[0] || 'Admin'}</span>
                </h1>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full tracking-widest ring-1 ring-emerald-200">
                  Root Admin
                </span>
              </div>
              <p className="text-gray-500 font-bold mt-1">Operational Analytics Overview</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 px-6 py-4 rounded-2xl font-bold transition-all border border-gray-100 hover:border-emerald-100 group/btn"
             >
               <RefreshCcw className={`h-5 w-5 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
               <span className="hidden sm:inline">{refreshing ? 'Syncing...' : 'Sync Data'}</span>
             </button>
             <button 
               onClick={() => setShowLogs(true)}
               className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
             >
               System Logs
             </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Inventory Value', 
            value: formatCurrency(summaryData.totalValue), 
            icon: DollarSign, 
            color: 'emerald', 
            trend: summaryData.totalValue > 0 ? 'Valuation Active' : 'No Value' 
          },
          { 
            label: 'Stock Items', 
            value: summaryData.totalStock.toLocaleString(), 
            icon: Package, 
            color: 'blue', 
            trend: `${summaryData.totalProducts} Types` 
          },
          { 
            label: 'Unique Products', 
            value: summaryData.totalProducts.toLocaleString(), 
            icon: LayoutGrid, 
            color: 'purple', 
            trend: 'System Active' 
          },
          { 
            label: 'Low Stock Alert', 
            value: lowStockCount, 
            icon: AlertTriangle, 
            color: lowStockCount > 0 ? 'amber' : 'emerald', 
            trend: lowStockCount > 0 ? 'Action Required' : 'All Healthy' 
          }
        ].map((item, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm group transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${item.color}-50 text-${item.color}-600 rounded-2xl group-hover:scale-110 transition-transform`}>
                <item.icon className="h-6 w-6" />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${item.color === 'amber' ? 'text-amber-600' : 'text-emerald-600'}`}>
                {item.trend}
              </span>
            </div>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">{item.label}</p>
            <h3 className="text-2xl font-black text-gray-900">{item.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution Bar Chart */}
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Stock by Category</h3>
              <p className="text-gray-500 text-sm font-bold">Physical item distribution</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="_id" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontWeight: 'bold', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontWeight: 'bold', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Bar 
                  dataKey="stock" 
                  fill="#10b981" 
                  radius={[8, 8, 0, 0]} 
                  barSize={40}
                  animationBegin={200}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Value Distribution Pie Chart */}
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Value Distribution</h3>
              <p className="text-gray-500 text-sm font-bold">Capital allocation per category</p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                  nameKey="_id"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Valuation Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          variants={itemVariants}
          className="bg-[#166534] text-white p-8 rounded-[40px] overflow-hidden relative group"
        >
          <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-700">
             <TrendingUp className="h-64 w-64 translate-x-1/4 translate-y-1/4" />
          </div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <h4 className="text-emerald-400 font-black uppercase tracking-[0.2em] text-xs mb-4">Capital Allocation</h4>
              <p className="text-emerald-100/70 font-bold mb-1">Most Valuable Category</p>
              <h2 className="text-3xl font-black mb-4 leading-tight">
                {stats?.topValuedCategory?._id || 'Loading...'}
                <span className="block text-emerald-400 mt-1">
                  {formatCurrency(stats?.topValuedCategory?.value || 0)}
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 mt-6">
               <TrendingUp className="h-4 w-4 text-emerald-400" />
               <span className="text-sm font-bold tracking-tight">Main capital concentration point</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-gray-900 text-white p-8 rounded-[40px] overflow-hidden relative group"
        >
          <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-700">
             <LayoutGrid className="h-64 w-64 translate-x-1/4 translate-y-1/4" />
          </div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <h4 className="text-blue-400 font-black uppercase tracking-[0.2em] text-xs mb-4">Asset Performance</h4>
              <p className="text-blue-100/70 font-bold mb-1">Highest Value Asset</p>
              <h2 className="text-2xl font-black mb-4 leading-tight truncate">
                {stats?.highestValueProduct?.title || 'Loading...'}
                <span className="block text-blue-400 mt-1 text-3xl">
                  {formatCurrency(stats?.highestValueProduct?.totalValue || 0)}
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 mt-6">
               <Activity className="h-4 w-4 text-blue-400" />
               <span className="text-sm font-bold tracking-tight">Top performing inventory item</span>
            </div>
          </div>
        </motion.div>
      </div>

        <motion.div 
          variants={itemVariants}
          className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group"
        >
          <h4 className="text-gray-900 text-xl font-black tracking-tight mb-6 flex items-center gap-2">
            Low Stock Alerts
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
          </h4>
          <div className="space-y-4">
            {lowStockCount > 0 ? (
               <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                     <AlertTriangle className="h-6 w-6" />
                   </div>
                   <div>
                     <p className="font-black text-gray-900">{lowStockCount} Products Low on Stock</p>
                     <p className="text-xs text-amber-700 font-bold uppercase tracking-widest">Immediate action recommended</p>
                   </div>
                 </div>
                 <button className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-amber-600 hover:shadow-lg transition-all">
                   <ChevronRight className="h-5 w-5" />
                 </button>
               </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <ShieldCheck className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-gray-500 font-bold">All stock levels are currently healthy</p>
              </div>
            )}
          </div>
        </motion.div>

      {/* System Logs Drawer */}
      <AnimatePresence>
        {showLogs && (
          <div className="fixed inset-0 z-[60] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowLogs(false)} 
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">System Events</h2>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Live Operation Log</p>
                </div>
                <button onClick={() => setShowLogs(false)} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {systemLogs.map((log) => (
                  <div key={log.id} className={`p-5 rounded-[24px] border backdrop-blur-md transition-all hover:scale-[1.02] ${
                    log.type === 'success' ? 'bg-emerald-50/40 border-emerald-100/50' :
                    log.type === 'warning' ? 'bg-amber-50/40 border-amber-100/50' :
                    'bg-blue-50/40 border-blue-100/50'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        log.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                        log.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {log.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : 
                         log.type === 'warning' ? <AlertTriangle className="h-5 w-5" /> : 
                         <Activity className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                            log.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
                            log.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {log.type === 'success' ? 'Database OK' : 
                             log.type === 'warning' ? 'System Alert' : 
                             'Service Info'}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">{log.time}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">{log.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-gray-50 border-t border-gray-100">
                <button 
                  onClick={() => setShowLogs(false)}
                  className="w-full bg-white border border-gray-200 py-4 rounded-2xl font-black text-gray-900 hover:bg-gray-100 transition-all"
                >
                  Close Console
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
