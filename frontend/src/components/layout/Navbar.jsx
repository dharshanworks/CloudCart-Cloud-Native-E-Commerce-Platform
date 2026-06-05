import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { CartContext } from '../../context/CartContext.jsx';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { itemCount } = useContext(CartContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar sticky top-0 z-50 border-b border-base-300 bg-base-100/95 shadow-md backdrop-blur">
      <div className="container mx-auto flex w-full items-center justify-between gap-3 px-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary hover:opacity-80 transition">
          🛒 CloudCart
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-3 sm:gap-5">
            <Link to="/products" className="link link-hover hidden font-medium sm:block">
            Products
          </Link>

          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className="link link-hover font-medium hidden sm:block text-warning">
              Admin
            </Link>
          )}

          {isAuthenticated && (
            <Link to="/orders" className="link link-hover hidden font-medium sm:block">
              Orders
            </Link>
          )}

          {isAuthenticated ? (
            <>
              {/* Cart */}
              <Link to="/cart" className="indicator">
                <span
                  className={`indicator-item badge badge-primary badge-sm font-bold ${
                    itemCount > 0 ? '' : 'badge-ghost'
                  }`}
                >
                  {itemCount}
                </span>
                <button className="btn btn-ghost btn-circle hover:bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 1a1 1 0 011-1h1.22l.305 1.222A.997.997 0 0 1 6.487 3h11.026a1 1 0 0 1 .978 1.222l-1.08 5.4A2 2 0 0 1 15.415 11H6.585a2 2 0 0 1-1.996-2.378l1.08-5.4A1 1 0 0 1 4.22 2H4a1 1 0 0 1-1-1zm14 16a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-9 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                  </svg>
                </button>
              </Link>

              {/* User Menu */}
              <div className="dropdown dropdown-end">
                 <button className="btn btn-ghost btn-circle avatar focus:bg-primary/10">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary-focus text-white flex items-center justify-center font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>
                <ul className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
                  <li>
                    <a className="font-semibold text-base-content" disabled>
                      {user?.name || 'User'}
                    </a>
                  </li>
                  <li>
                    <a className="text-xs text-base-content/60">{user?.email}</a>
                  </li>
                  <li>
                    <Link to="/orders">My Orders</Link>
                  </li>
                  {user?.role === 'admin' && (
                    <li>
                      <Link to="/admin">Admin Dashboard</Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-error hover:bg-error hover:bg-opacity-10"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm hidden sm:flex">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <div className="dropdown dropdown-end sm:hidden">
            <button className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </button>
            <ul className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
              <li>
                <Link to="/products">Products</Link>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <Link to="/orders">Orders</Link>
                  </li>
                  {user?.role === 'admin' && (
                    <li>
                      <Link to="/admin" className="text-warning">
                        Admin
                      </Link>
                    </li>
                  )}
                </>
              )}
              {!isAuthenticated && (
                <>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/register">Sign Up</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
