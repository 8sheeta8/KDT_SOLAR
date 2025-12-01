import axios from 'axios';

// 환경 변수에서 API 주소를 읽어오도록 수정
const API_BASE_URL = 'https://3qyx5d3gce.execute-api.us-east-1.amazonaws.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const login = (credentials) => api.post('/api/auth/login', credentials);
export const signup = (userData) => api.post('/api/auth/signup', userData);

// Product APIs
export const getProducts = (params) => api.get('/api/products', { params });
export const getProduct = (id) => api.get(`/api/products/${id}`);

// Order APIs
export const createOrder = (orderData) => api.post('/api/orders', orderData);
export const getOrders = () => api.get('/api/orders');

// 관리자
export const createProduct = (productData) => api.post('/api/products', productData);

export default api;