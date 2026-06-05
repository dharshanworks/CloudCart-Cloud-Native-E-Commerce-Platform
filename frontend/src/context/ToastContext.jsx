import React, { createContext, useState, useCallback, useContext } from 'react';

export const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    (message, type = 'info', duration = 3000) => {
      const id = Date.now();
      const toast = { id, message, type };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message, duration = 3000) => addToast(message, 'success', duration),
    [addToast]
  );

  const error = useCallback(
    (message, duration = 5000) => addToast(message, 'error', duration),
    [addToast]
  );

  const warning = useCallback(
    (message, duration = 4000) => addToast(message, 'warning', duration),
    [addToast]
  );

  const info = useCallback(
    (message, duration = 3000) => addToast(message, 'info', duration),
    [addToast]
  );

  const value = {
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    toasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
