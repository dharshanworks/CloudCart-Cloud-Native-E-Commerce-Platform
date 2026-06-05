import { Link } from 'react-router-dom';
import { useState } from 'react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="mt-16 bg-linear-to-b from-base-200 to-base-300 text-base-content border-t border-base-300">
      {/* Newsletter Section */}
      <div className="bg-linear-to-r from-gray-900 via-stone-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="mb-4 text-white/90">
              Subscribe to our newsletter for the latest offers and updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="your@email.com"
                className="input input-bordered input-sm flex-1 bg-base-200 text-base-content"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-neutral btn-sm text-white">
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="mt-2 text-sm font-semibold text-white/70">✓ Thank you for subscribing!</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-3xl font-bold text-primary mb-4 block">
              🛒 CloudCart
            </Link>
            <p className="mb-4 text-sm text-base-content/75">
              Your trusted online shopping destination for quality products at unbeatable prices.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="#" className="btn btn-ghost btn-xs btn-circle" title="Facebook">
                f
              </a>
              <a href="#" className="btn btn-ghost btn-xs btn-circle" title="Twitter">
                𝕏
              </a>
              <a href="#" className="btn btn-ghost btn-xs btn-circle" title="Instagram">
                📷
              </a>
              <a href="#" className="btn btn-ghost btn-xs btn-circle" title="LinkedIn">
                in
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-base">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="link link-hover">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="link link-hover">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/products" className="link link-hover">
                  Categories
                </Link>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Flash Sales
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4 text-base">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="link link-hover">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4 text-base">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="link link-hover">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4 text-base">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="link link-hover">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Returns Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="divider my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 text-sm text-base-content/75 md:flex-row md:items-center md:justify-between">
          <div>
            <p>&copy; 2024-2025 CloudCart. All rights reserved.</p>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-base-content">Secure Payments:</span>
            <div className="flex gap-2">
              <span className="badge badge-outline">💳 Visa</span>
              <span className="badge badge-outline">💳 Mastercard</span>
              <span className="badge badge-outline">🏦 PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
