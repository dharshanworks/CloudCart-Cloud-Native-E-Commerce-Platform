import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.jsx';
import { ToastContainer } from './components/common/ToastContainer.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <CartProvider>
          <AuthProvider>
            <ToastProvider>
              <AppRoutes />
              <ToastContainer />
            </ToastProvider>
          </AuthProvider>
        </CartProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;