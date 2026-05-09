import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Reuse the token logic from auth.js (ideally this should be in a common api.js)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getStats: () => api.get('/products/stats'),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.patch(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`)
};
