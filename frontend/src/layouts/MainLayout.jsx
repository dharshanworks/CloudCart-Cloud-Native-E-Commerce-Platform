import { Outlet } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';

export const MainLayout = () => {
  const { isAuthenticated } = useContext(AuthContext);

  const cartContext = useContext(CartContext);
  const fetchCart = cartContext?.fetchCart || (() => {});

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 w-full px-4 py-8">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};