import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const ordersAPI = {
  // Get user orders
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get order by ID
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create new order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Update order status (Admin only)
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}`, { status });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },

  // Get order tracking
  getOrderTracking: async (id) => {
    const response = await api.get(`/orders/${id}/tracking`);
    return response.data;
  },

  // Get all orders (Admin only)
  getAllOrders: async (params = {}) => {
    const response = await api.get('/orders/all', { params });
    return response.data;
  },

  // Get order statistics (Admin only)
  getOrderStats: async () => {
    const response = await api.get('/orders/stats');
    return response.data;
  },

  // Get order analytics (Admin only)
  getOrderAnalytics: async (period = 'month') => {
    const response = await api.get('/orders/analytics', {
      params: { period }
    });
    return response.data;
  },
};

export default ordersAPI;
