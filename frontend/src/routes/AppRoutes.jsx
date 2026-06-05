import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.jsx';
import { ProtectedRoute } from '../components/auth/ProtectedRoute.jsx';
import { Home } from '../pages/Home/Home.jsx';
import { Products } from '../pages/Products/Products.jsx';
import { ProductDetails } from '../pages/ProductDetails/ProductDetails.jsx';
import { Cart } from '../pages/Cart/Cart.jsx';
import { Checkout } from '../pages/Checkout/Checkout.jsx';
import { Login } from '../pages/Login/Login.jsx';
import { Register } from '../pages/Register/Register.jsx';
import { Orders } from '../pages/Orders/Orders.jsx';
import { OrderDetails } from '../pages/Orders/OrderDetails.jsx';
import { AdminDashboard } from '../pages/Admin/AdminDashboard.jsx';
import { NotFound } from '../pages/NotFound/NotFound.jsx';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="products" element={<Products />} />
      <Route path="products/:id" element={<ProductDetails />} />
      <Route
        path="cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Route>
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
