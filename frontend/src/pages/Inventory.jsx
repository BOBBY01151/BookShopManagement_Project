import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  AlertCircle,
  X,
  Loader2,
  BookOpen,
  DollarSign,
  Tag,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  MinusCircle,
  Layers,
  ChevronLeft,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productsAPI } from '../api/products';
import { categoriesAPI } from '../api/categories';
import { toast } from 'react-hot-toast';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [newSubcategory, setNewSubcategory] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    subcategory: '',
    price: '',
    stock: '',
    description: ''
  });

  const [categoryData, setCategoryData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, [currentPage, selectedCategory]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: currentPage,
        limit: 10
      };

      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      const [prodRes, catRes] = await Promise.all([
        productsAPI.getProducts(params),
        categoriesAPI.getCategories()
      ]);
      
      setProducts(prodRes.data.data.products);
      setTotalPages(prodRes.data.pages);
      setTotalResults(prodRes.data.total);
      setCategories(catRes.data.data.categories);
      
      if (catRes.data.data.categories.length > 0 && !formData.category) {
        setFormData(prev => ({ 
          ...prev, 
          category: catRes.data.data.categories[0].name,
          subcategory: '' 
        }));
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (catName) => {
    setSelectedCategory(catName);
    setCurrentPage(1);
  };

  const getSelectedCategorySubcategories = () => {
    const selected = categories.find(c => c.name === formData.category);
    return selected?.subcategories || [];
  };

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setFormData(prev => ({
      ...prev,
      category: newCat,
      subcategory: ''
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      toast.error('Please create a category first');
      return;
    }
    try {
      await productsAPI.createProduct(formData);
      toast.success('Item added to inventory');
      setIsModalOpen(false);
      setFormData({ 
        title: '', 
        author: '', 
        category: categories[0]?.name || '', 
        subcategory: '',
        price: '', 
        stock: '', 
        description: '' 
      });
      fetchInitialData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await categoriesAPI.createCategory(categoryData);
      toast.success('Category created successfully');
      setIsCategoryModalOpen(false);
      setCategoryData({ name: '', description: '' });
      fetchInitialData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create category');
    }
  };

  const handleAddSubcategory = async (categoryId) => {
    if (!newSubcategory.trim()) return;
    const category = categories.find(c => c._id === categoryId);
    const updatedSubcategories = [...(category.subcategories || []), newSubcategory.trim()];
    try {
      await categoriesAPI.updateCategory(categoryId, { subcategories: updatedSubcategories });
      toast.success('Subcategory added');
      setNewSubcategory('');
      fetchInitialData();
    } catch (error) {
      toast.error('Failed to add subcategory');
    }
  };

  const handleRemoveSubcategory = async (categoryId, subIndex) => {
    const category = categories.find(c => c._id === categoryId);
    const updatedSubcategories = category.subcategories.filter((_, index) => index !== subIndex);
    try {
      await categoriesAPI.updateCategory(categoryId, { subcategories: updatedSubcategories });
      toast.success('Subcategory removed');
      fetchInitialData();
    } catch (error) {
      toast.error('Failed to remove subcategory');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoriesAPI.deleteCategory(id);
        toast.success('Category deleted');
        fetchInitialData();
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Inventory Management</h1>
          <p className="text-gray-500 font-bold mt-1 text-sm uppercase tracking-widest">Real-time Item Repository</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-white border border-gray-100 text-gray-700 px-6 py-4 rounded-2xl font-black shadow-sm hover:bg-gray-50 transition-all flex items-center gap-3"
          >
            <Tag className="h-5 w-5" />
            Categories
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#166534] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
          >
            <Plus className="h-5 w-5" />
            Add New Item
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="md:col-span-8 relative group">
          <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-[#22c55e] transition-colors" />
          <input 
            type="text"
            placeholder="Search by title, author or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-green-500/10 focus:border-[#22c55e] outline-none shadow-sm transition-all"
          />
        </div>

        {/* Category Dropdown Filter */}
        <div className="md:col-span-4 relative group flex items-center">
          <LayoutGrid className="absolute left-5 h-5 w-5 text-gray-400 group-focus-within:text-[#166534] pointer-events-none z-10" />
          <select 
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="w-full pl-14 pr-12 py-4 bg-white border border-gray-100 rounded-2xl font-black text-gray-900 focus:ring-2 focus:ring-green-500/10 focus:border-[#166534] outline-none shadow-sm transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-5 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 text-[#22c55e] animate-spin" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Syncing Repository...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="p-6 bg-gray-50 rounded-full text-gray-300 mb-6">
              <Boxes className="h-16 w-16" />
            </div>
            <h3 className="text-xl font-black text-gray-900">No items found</h3>
            <p className="text-gray-500 mt-2 font-medium max-w-xs">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Item Details</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Classification</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Level</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-[#166534] font-black">
                            {product.title.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900">{product.title}</p>
                            <p className="text-xs text-gray-500 font-bold mt-0.5">{product.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[9px] font-black uppercase rounded tracking-wider w-fit">
                            {product.category}
                          </span>
                          {product.subcategory && (
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded tracking-wider w-fit">
                              {product.subcategory}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-black ${product.stock < 10 ? 'text-red-500' : 'text-gray-900'}`}>
                            {product.stock} units
                          </span>
                          {product.stock < 10 && <AlertCircle className="h-4 w-4 text-red-500" />}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-[#22c55e]">${product.price.toFixed(2)}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-1.5">
                          <div className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? 'bg-[#22c55e]' : 'bg-red-500'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'text-[#166534]' : 'text-red-600'}`}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-auto px-8 py-6 border-t border-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Showing {products.length} of {totalResults} items
              </p>
              <div className="flex items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {[...Array(totalPages)].map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`h-11 w-11 rounded-xl font-black text-sm transition-all ${currentPage === idx + 1 ? 'bg-[#166534] text-white shadow-lg shadow-green-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#166534] rounded-2xl flex items-center justify-center text-white shadow-lg"><Plus className="h-6 w-6" /></div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Add New Item</h2>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Inventory Enrollment</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors"><X className="h-6 w-6" /></button>
              </div>
              <form onSubmit={handleAddProduct} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Item Title</label>
                    <div className="relative group">
                      <BookOpen className="absolute left-5 top-5 h-5 w-5 text-gray-400 group-focus-within:text-[#22c55e] transition-colors" />
                      <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Enter item title" className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Author/Supplier</label>
                    <div className="relative group">
                      <Search className="absolute left-5 top-5 h-5 w-5 text-gray-400 group-focus-within:text-[#22c55e] transition-colors" />
                      <input required value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} placeholder="Name of author or supplier" className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Main Category</label>
                    <div className="relative">
                      <Tag className="absolute left-5 top-5 h-5 w-5 text-gray-400 pointer-events-none" />
                      <select required value={formData.category} onChange={handleCategoryChange} className="w-full pl-14 pr-12 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 outline-none transition-all appearance-none">
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-5 top-5 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subcategory</label>
                    <div className="relative">
                      <Layers className="absolute left-5 top-5 h-5 w-5 text-gray-400 pointer-events-none" />
                      <select value={formData.subcategory} disabled={!formData.category || getSelectedCategorySubcategories().length === 0} onChange={(e) => setFormData({...formData, subcategory: e.target.value})} className={`w-full pl-14 pr-12 py-4 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 outline-none transition-all appearance-none ${!formData.category || getSelectedCategorySubcategories().length === 0 ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-gray-50'}`}>
                        <option value="">{getSelectedCategorySubcategories().length === 0 ? 'No Subcategories' : 'Select Subcategory'}</option>
                        {getSelectedCategorySubcategories().map((sub, idx) => (<option key={idx} value={sub}>{sub}</option>))}
                      </select>
                      <ChevronDown className="absolute right-5 top-5 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price</label>
                      <div className="relative group">
                        <DollarSign className="absolute left-4 top-5 h-4 w-4 text-gray-400 group-focus-within:text-[#22c55e] transition-colors" />
                        <input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="0.00" className="w-full pl-10 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 outline-none transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock</label>
                      <div className="relative group">
                        <Boxes className="absolute left-4 top-5 h-4 w-4 text-gray-400 group-focus-within:text-[#22c55e] transition-colors" />
                        <input type="number" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} placeholder="0" className="w-full pl-10 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description (Optional)</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 outline-none transition-all resize-none" placeholder="Provide a brief summary of the item..." />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-[#166534] text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-[0.98] transition-all">Commit to Inventory</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 bg-gray-100 text-gray-500 rounded-[24px] font-black hover:bg-gray-200 transition-colors">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Modal remains identical */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCategoryModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Tag className="h-6 w-6" /></div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Manage Categories</h2>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Custom Taxonomy</p>
                  </div>
                </div>
                <button onClick={() => setIsCategoryModalOpen(false)} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors"><X className="h-6 w-6" /></button>
              </div>
              <div className="p-8 space-y-8">
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Category Name</label>
                    <div className="flex gap-3">
                      <input required value={categoryData.name} onChange={(e) => setCategoryData({...categoryData, name: e.target.value})} placeholder="e.g., Science Fiction" className="flex-1 px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                      <button type="submit" className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:scale-[1.02] transition-all">Add</button>
                    </div>
                  </div>
                </form>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {categories.map((cat) => (
                    <div key={cat._id} className="space-y-2">
                      <div className={`flex items-center justify-between p-4 bg-gray-50 rounded-2xl group transition-all border ${expandedCategoryId === cat._id ? 'border-blue-200 bg-white shadow-md' : 'border-transparent hover:border-gray-100'}`}>
                        <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => setExpandedCategoryId(expandedCategoryId === cat._id ? null : cat._id)}>
                          <div className={`h-2 w-2 rounded-full ${expandedCategoryId === cat._id ? 'bg-blue-600 animate-pulse' : 'bg-blue-400'}`} />
                          <span className="font-bold text-gray-900">{cat.name}</span>
                          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-black ml-2">{cat.subcategories?.length || 0}</span>
                          {expandedCategoryId === cat._id ? <ChevronDown className="h-4 w-4 ml-auto text-gray-400" /> : <ChevronRight className="h-4 w-4 ml-auto text-gray-300" />}
                        </div>
                        <button onClick={() => handleDeleteCategory(cat._id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors ml-2"><Trash2 className="h-4 w-4" /></button>
                      </div>
                      <AnimatePresence>
                        {expandedCategoryId === cat._id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-gray-50/50 rounded-2xl mx-2 border border-gray-100">
                            <div className="p-4 space-y-4">
                              <div className="flex gap-2">
                                <input value={newSubcategory} onChange={(e) => setNewSubcategory(e.target.value)} placeholder="New subcategory..." className="flex-1 text-xs px-4 py-2 rounded-xl border-none bg-white font-bold outline-none ring-1 ring-gray-100 focus:ring-blue-400 transition-all" />
                                <button onClick={() => handleAddSubcategory(cat._id)} className="p-2 bg-blue-600 text-white rounded-xl hover:scale-105 active:scale-95 transition-all"><PlusCircle className="h-4 w-4" /></button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {cat.subcategories?.map((sub, idx) => (
                                  <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                                    <span className="text-[11px] font-bold text-gray-600">{sub}</span>
                                    <button onClick={() => handleRemoveSubcategory(cat._id, idx)} className="text-gray-300 hover:text-red-500 transition-colors"><MinusCircle className="h-3 w-3" /></button>
                                  </div>
                                ))}
                                {(!cat.subcategories || cat.subcategories.length === 0) && (<p className="text-[10px] text-gray-400 font-bold italic ml-2 py-2">No subcategories defined</p>)}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
