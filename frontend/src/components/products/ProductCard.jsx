import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Package } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ProductCard = ({ product, showAddToCart = true }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product, 1);
    toast.success(`${product.title} added to cart!`);
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'books':
        return '📚';
      case 'pens':
        return '✏️';
      case 'toys':
        return '🧸';
      case 'supplies':
        return '📝';
      case 'art':
        return '🎨';
      case 'backpacks':
        return '🎒';
      default:
        return '📦';
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600' };
    if (stock < 10) return { text: 'Low Stock', color: 'text-orange-600' };
    return { text: 'In Stock', color: 'text-green-600' };
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="book-card group">
      <Link to={`/products/${product._id}`} className="block">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img
            src={product.image || '/api/placeholder/300/300'}
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/api/placeholder/300/300';
            }}
          />
          
          {/* Category Badge */}
          <div className="absolute top-2 left-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
            <span>{getCategoryIcon(product.category)}</span>
            <span className="capitalize">{product.category}</span>
          </div>

          {/* Stock Status */}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color} bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm`}>
            {stockStatus.text}
          </div>

          {/* Wishlist Button */}
          <button
            className="absolute bottom-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.success('Added to wishlist!');
            }}
          >
            <Heart className="h-4 w-4 text-gray-600 dark:text-gray-400 hover:text-red-500" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.title}
          </h3>

          {/* Author/Brand */}
          {product.author && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              by {product.author}
            </p>
          )}

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            
            {/* Stock Indicator */}
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <Package className="h-3 w-3" />
              <span>{product.stock} left</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          {showAddToCart && product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="w-full btn btn-primary py-2 text-sm flex items-center justify-center space-x-2 group-hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </button>
          )}

          {product.stock === 0 && (
            <button
              disabled
              className="w-full btn btn-secondary py-2 text-sm cursor-not-allowed opacity-50"
            >
              Out of Stock
            </button>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
