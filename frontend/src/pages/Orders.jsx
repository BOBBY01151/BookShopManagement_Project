import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { 
  Package, 
  Calendar, 
  DollarSign, 
  Eye, 
  Truck,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ordersAPI } from '../api/orders';
import { formatCurrency, formatDate } from '../utils/helpers';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../utils/constants';

const Orders = () => {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch user orders
  const { data: ordersData, isLoading, error } = useQuery(
    ['user-orders'],
    () => ordersAPI.getOrders(),
    {
      enabled: !!user,
    }
  );

  const orders = ordersData?.data?.orders || [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading orders..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error loading orders
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {error.message || 'Something went wrong. Please try again.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track and manage your orders
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <div className="mb-6">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                No orders yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
            </div>
            <a
              href="/products"
              className="btn btn-primary px-8 py-3 text-lg font-medium"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                      {getStatusIcon(order.status)}
                      <span>{ORDER_STATUS_LABELS[order.status]}</span>
                    </span>
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                      className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>{selectedOrder === order._id ? 'Hide' : 'View'} Details</span>
                    </button>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  {order.books.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-shrink-0">
                        <img
                          src={item.book.image || '/api/placeholder/80/80'}
                          alt={item.book.title}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/80/80';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {item.book.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {getCategoryIcon(item.book.category)} {item.book.category}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(item.price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4" />
                        <span>{order.books.length} {order.books.length === 1 ? 'item' : 'items'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        Total: {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Details (Expandable) */}
                {selectedOrder === order._id && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                      Order Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Shipping Address */}
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                          Shipping Address
                        </h5>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {order.shippingAddress ? (
                            <div>
                              <p>{order.shippingAddress.street}</p>
                              <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                              </p>
                              <p>{order.shippingAddress.country}</p>
                            </div>
                          ) : (
                            <p>No shipping address provided</p>
                          )}
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                          Payment Information
                        </h5>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <p>Payment Method: {order.paymentMethod || 'Not specified'}</p>
                          <p>Payment Status: {order.paymentStatus || 'Pending'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="mt-6 flex space-x-4">
                      {order.status === 'pending' && (
                        <button className="btn btn-secondary px-4 py-2 text-sm">
                          Cancel Order
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <button className="btn btn-primary px-4 py-2 text-sm">
                          Leave Review
                        </button>
                      )}
                      <button className="btn btn-secondary px-4 py-2 text-sm">
                        Download Invoice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
