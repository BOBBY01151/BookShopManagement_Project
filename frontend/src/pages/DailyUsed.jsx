import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, Star, History, TrendingUp } from 'lucide-react';
import { productsAPI } from '../api/products';
import { categoriesAPI } from '../api/categories';
import { dailyUsageAPI } from '../api/dailyUsage';
import toast from 'react-hot-toast';

const DailyUsed = () => {
  const [loading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [usageRecords, setUsageRecords] = React.useState([]);
  const [selection, setSelection] = React.useState({
    category: '',
    subcategory: '',
    productId: ''
  });
  const [quantity, setQuantity] = React.useState('');

  const fetchData = async () => {
    try {
      const [prodRes, catRes, usageRes] = await Promise.all([
        productsAPI.getProducts({ limit: 1000 }), // Get all for filtering
        categoriesAPI.getCategories(),
        dailyUsageAPI.getTodayUsage()
      ]);
      
      if (prodRes.data.status === 'success') setProducts(prodRes.data.data.products);
      if (catRes.data.status === 'success') setCategories(catRes.data.data.categories);
      if (usageRes.data.status === 'success') {
        const formattedUsage = usageRes.data.data.usage.map(u => ({
          id: u._id,
          productTitle: u.product.title,
          quantity: u.quantity,
          time: new Date(u.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          impact: u.totalValueImpact
        }));
        setUsageRecords(formattedUsage);
      }
    } catch (error) {
      toast.error('Failed to sync system data');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const getSubcategories = () => {
    const cat = categories.find(c => c.name === selection.category);
    return cat?.subcategories || [];
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = !selection.category || p.category === selection.category;
    const matchesSub = !selection.subcategory || p.subcategory === selection.subcategory;
    return matchesCat && matchesSub;
  });

  const handleRecordUsage = async (e) => {
    e.preventDefault();
    const product = products.find(p => p._id === selection.productId);
    const usedQty = parseInt(quantity);

    if (!product || !usedQty) return;

    if (usedQty > product.stock) {
      toast.error(`Insufficient Stock! Only ${product.stock} units available.`);
      return;
    }

    try {
      const response = await dailyUsageAPI.recordUsage({
        productId: selection.productId,
        quantity: usedQty
      });

      if (response.data.status === 'success') {
        toast.success(`${product.title} checkout successful`);
        setSelection({ category: '', subcategory: '', productId: '' });
        setQuantity('');
        fetchData(); // Refresh all data
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    }
  };

  const selectedProduct = products.find(p => p._id === selection.productId);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const Skeleton = ({ className }) => (
    <div className={`relative overflow-hidden bg-gray-100 rounded-2xl ${className}`}>
      <motion.div 
        animate={{ x: ['-100%', '100%'] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/2 h-full -skew-x-12"
      />
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-80" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Skeleton className="h-96 w-full rounded-[40px]" />
           <Skeleton className="lg:col-span-2 h-96 w-full rounded-[40px]" />
        </div>
      </div>
    );
  }

  const formatCurrency = (val) => `Rs. ${val.toLocaleString()}`;

  const stats = [
    { label: 'Most Used Today', value: 'Ballpoint Pens', icon: TrendingUp, color: 'emerald' },
    { label: 'Avg. Requests', value: '42 / hr', icon: Clock, color: 'blue' },
    { label: 'Top Category', value: 'Stationery', icon: Star, color: 'purple' },
    { label: 'Last Sync', value: '2m ago', icon: History, color: 'amber' },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h4 className="text-[#22c55e] font-black uppercase tracking-[0.3em] text-xs mb-2">Inventory Checkout</h4>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Daily Used <span className="text-[#22c55e]">Operations</span></h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            Record Usage
            <div className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
          </h3>
          <form onSubmit={handleRecordUsage} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Main Category</label>
              <select 
                value={selection.category}
                onChange={(e) => setSelection({ ...selection, category: e.target.value, subcategory: '', productId: '' })}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subcategory</label>
              <select 
                disabled={!selection.category}
                value={selection.subcategory}
                onChange={(e) => setSelection({ ...selection, subcategory: e.target.value, productId: '' })}
                className={`w-full px-6 py-4 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 outline-none transition-all ${!selection.category ? 'bg-gray-100 opacity-50' : 'bg-gray-50'}`}
              >
                <option value="">All Subcategories</option>
                {getSubcategories().map((sub, idx) => <option key={idx} value={sub}>{sub}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Product</label>
              <select 
                required
                value={selection.productId}
                onChange={(e) => setSelection({...selection, productId: e.target.value})}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
              >
                <option value="">Choose item...</option>
                {filteredProducts.map(p => (
                  <option key={p._id} value={p._id}>{p.title} ({p.stock} in stock)</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantity to Use</label>
              <input 
                type="number"
                required
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
              />
            </div>

            {selectedProduct && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100"
              >
                <div className="flex justify-between items-center text-xs font-bold text-emerald-800">
                  <span>Current Stock:</span>
                  <span>{selectedProduct.stock}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-emerald-800 mt-1">
                  <span>New Balance:</span>
                  <span className="text-sm font-black">{selectedProduct.stock - (parseInt(quantity) || 0)}</span>
                </div>
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={!selection.productId || !quantity}
              className="w-full bg-[#166534] text-white py-4 rounded-2xl font-black shadow-lg shadow-green-900/20 hover:bg-[#114d27] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Zap className="h-5 w-5" />
              Confirm Checkout
            </button>
          </form>
        </motion.div>

        {/* Usage Log */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900">Today's Consumption Log</h3>
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Live Updates</span>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            {usageRecords.length === 0 ? (
              <div className="p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="bg-gray-50 h-20 w-20 rounded-3xl flex items-center justify-center mb-6 text-gray-300">
                   <History className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-black text-gray-900">No entries recorded</h3>
                <p className="text-gray-500 font-medium mt-2 max-w-sm">Products used today will appear here with their stock impact.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Item</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Qty</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Value Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {usageRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-5 font-black text-gray-900 text-sm">{record.productTitle}</td>
                      <td className="px-8 py-5 font-bold text-emerald-600">-{record.quantity} units</td>
                      <td className="px-8 py-5 text-xs text-gray-400 font-bold uppercase">{record.time}</td>
                      <td className="px-8 py-5 font-black text-gray-900 text-sm">{formatCurrency(record.impact)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DailyUsed;
