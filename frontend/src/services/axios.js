import axios from 'axios';

const normalizeApiUrl = (value) => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  // Supports VITE_API_URL=/api when using Vite dev proxy
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  // Fixes malformed values like :5000/api
  if (trimmed.startsWith(':')) {
    return `${window.location.protocol}//${window.location.hostname}${trimmed}`;
  }

  // Fixes localhost:5000/api (missing protocol)
  if (/^(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(trimmed)) {
    return `${window.location.protocol}//${trimmed}`;
  }

  return trimmed;
};

const configuredApiUrl = normalizeApiUrl(import.meta.env.VITE_API_URL);
const defaultApiUrl = '/api';
const BASE_URL = configuredApiUrl || defaultApiUrl;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Store the attempted URL for redirect after login
      const attemptedUrl = window.location.pathname + window.location.search;
      if (attemptedUrl && attemptedUrl !== '/login') {
        localStorage.setItem('redirectAfterLogin', attemptedUrl);
      }
      
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
