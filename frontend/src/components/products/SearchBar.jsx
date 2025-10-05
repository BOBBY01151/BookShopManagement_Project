import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, Filter } from 'lucide-react';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search books, pens, toys...",
  showFilters = true,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'relevance',
    inStock: false
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Get search params from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const inStock = searchParams.get('inStock') === 'true';

    setQuery(searchQuery);
    setFilters({
      category,
      minPrice,
      maxPrice,
      sortBy,
      inStock
    });
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const searchParams = new URLSearchParams();
      searchParams.set('search', query.trim());
      
      // Add filters to URL
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'relevance') {
          searchParams.set(key, value);
        }
      });

      navigate(`/products?${searchParams.toString()}`);
      
      if (onSearch) {
        onSearch(query.trim(), filters);
      }
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL with new filters
    const searchParams = new URLSearchParams(location.search);
    if (value && value !== 'relevance') {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    
    navigate(`/products?${searchParams.toString()}`);
    
    if (onSearch) {
      onSearch(query, newFilters);
    }
  };

  const clearFilters = () => {
    const newFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'relevance',
      inStock: false
    };
    setFilters(newFilters);
    setQuery('');
    
    navigate('/products');
    
    if (onSearch) {
      onSearch('', newFilters);
    }
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'books', label: 'Books' },
    { value: 'pens', label: 'Pens & Pencils' },
    { value: 'toys', label: 'Toys' },
    { value: 'supplies', label: 'School Supplies' },
    { value: 'art', label: 'Art & Craft' },
    { value: 'backpacks', label: 'Backpacks' },
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-lg"
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-4">
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {showFilterPanel ? (
              <span className="text-sm">(Hide)</span>
            ) : (
              <span className="text-sm">(Show)</span>
            )}
          </button>

          {/* Filter Panel */}
          {showFilterPanel && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full input py-2"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="0"
                    className="w-full input py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="1000"
                    className="w-full input py-2"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full input py-2"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Additional Filters */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    In Stock Only
                  </span>
                </label>
              </div>

              {/* Clear Filters */}
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
