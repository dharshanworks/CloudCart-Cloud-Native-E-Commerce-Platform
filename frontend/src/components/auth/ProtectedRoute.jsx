import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    // Store the attempted URL for redirect after login
    const attemptedUrl = location.pathname + location.search;
    if (attemptedUrl && attemptedUrl !== '/login') {
      localStorage.setItem('redirectAfterLogin', attemptedUrl);
    }
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};
