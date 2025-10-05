import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, Package } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/helpers';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(item._id);
      return;
    }
    if (newQuantity > item.stock) {
      return; // Don't allow more than available stock
    }
    updateQuantity(item._id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item._id);
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <Link to={`/products/${item._id}`}>
            <img
              src={item.image || '/api/placeholder/100/100'}
              alt={item.title}
              className="w-20 h-20 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = '/api/placeholder/100/100';
              }}
            />
          </Link>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link
                to={`/products/${item._id}`}
                className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
              >
                {item.title}
              </Link>
              
              {item.author && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  by {item.author}
                </p>
              )}

              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full flex items-center space-x-1">
                  <span>{getCategoryIcon(item.category)}</span>
                  <span className="capitalize">{item.category}</span>
                </span>
                
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <Package className="h-3 w-3" />
                  <span>{item.stock} in stock</span>
                </div>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              title="Remove from cart"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Price and Quantity Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                
                <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  disabled={item.quantity >= item.stock}
                >
                  <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Unit Price */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formatCurrency(item.price)} each
              </div>
            </div>

            {/* Total Price */}
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(item.price * item.quantity)}
              </div>
              {item.quantity > 1 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {item.quantity} × {formatCurrency(item.price)}
                </div>
              )}
            </div>
          </div>

          {/* Stock Warning */}
          {item.quantity >= item.stock && (
            <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p className="text-xs text-orange-800 dark:text-orange-200">
                ⚠️ You've reached the maximum available stock for this item.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
