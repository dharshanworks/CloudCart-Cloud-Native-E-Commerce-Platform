import { createContext, useState, useCallback, useEffect } from 'react';
import { cartService } from '../services/cartService.js';



export const CartContext = createContext({
  cart: null,
  loading: false,
  error: null,
  fetchCart: () => {},
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  itemCount: 0,
});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.getCart();
      if (response.success) {
        setCart(response.data.cart);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId, quantity) => {
    setError(null);
    try {
      const response = await cartService.addToCart(productId, quantity);
      if (response.success) {
        setCart(response.data.cart);
      }
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add to cart';
      setError(message);
      throw err;
    }
  }, []);

  const updateQuantity = useCallback(async (productId, quantity) => {
    setError(null);
    try {
      const response = await cartService.updateQuantity(productId, quantity);
      if (response.success) {
        setCart(response.data.cart);
      }
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update cart';
      setError(message);
      throw err;
    }
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    setError(null);
    try {
      const response = await cartService.removeFromCart(productId);
      if (response.success) {
        setCart(response.data.cart);
      }
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to remove from cart';
      setError(message);
      throw err;
    }
  }, []);

  const clearCart = useCallback(async () => {
    setError(null);
    try {
      const response = await cartService.clearCart();
      if (response.success) {
        setCart(null);
      }
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to clear cart';
      setError(message);
      throw err;
    }
  }, []);

  const value = {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount: cart?.totalItems || 0,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
