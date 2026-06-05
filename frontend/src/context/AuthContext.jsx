import { createContext, useState, useCallback, useContext, useEffect } from 'react';
import { authService } from '../services/authService.js';
import { CartContext } from './CartContext.jsx';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cartContext = useContext(CartContext);

  const fetchCart = cartContext?.fetchCart || (async () => { });

  // Validate token on mount and clear if expired
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && user) {
      // Token validation would require decoding JWT on frontend
      // For now, we'll attempt to fetch user profile to validate token
      const validateToken = async () => {
        try {
          await authService.getProfile();
          // Token is valid, fetch cart
          await fetchCart();
        } catch (err) {
          // Token is invalid or expired, clear auth state
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      };
      validateToken();
    }
  }, [user, fetchCart]);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(name, email, password);
      if (response.success) {
        return response;
      }
      throw new Error(response.message || 'Registration failed');
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        setUser(response.data.user);
        // Fetch cart after successful login
        await fetchCart();
        return response;
      }
      throw new Error(response.message || 'Login failed');
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
