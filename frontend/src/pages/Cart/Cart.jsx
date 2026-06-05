import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { CartItem } from '../../components/cart/CartItem.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { configService } from '../../services/configService.js';

export const Cart = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { cart, loading, error, fetchCart, updateQuantity, removeFromCart, clearCart } =
    useContext(CartContext);
  
  const [pricing, setPricing] = useState({ taxRate: 0.08, shippingCost: 10, freeShippingThreshold: 100 });

  useEffect(() => {
    if (!cart) {
      fetchCart();
    }
  }, [cart, fetchCart]);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const result = await configService.getPricing();
        if (result?.success && result.data) {
          setPricing({
            taxRate: result.data.DEFAULT_TAX_RATE,
            shippingCost: result.data.DEFAULT_SHIPPING_COST,
            freeShippingThreshold: result.data.FREE_SHIPPING_THRESHOLD,
          });
        }
      } catch (err) {
        console.error('Failed to load pricing config');
      }
    };
    fetchPricing();
  }, []);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
      toast.success('Quantity updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    try {
      await clearCart();
      toast.success('Cart cleared');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to clear cart');
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-4xl font-bold">Shopping Cart</h1>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse border border-base-300 bg-base-100 shadow">
                  <div className="card-body h-32"></div>
                </div>
              ))}
            </div>
            <div className="card animate-pulse border border-base-300 bg-base-100 shadow">
              <div className="card-body h-64"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="container mx-auto px-4 py-8">
          <div className="alert alert-error mb-6 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m8-8l2 2m0 0l2 2m-2-2l-2-2m2 2l2-2"
              />
            </svg>
            <div>
              <h3 className="font-bold">Error</h3>
              <div className="text-sm">{error}</div>
            </div>
            <button
              onClick={fetchCart}
              className="btn btn-sm btn-ghost transition-transform duration-200 hover:scale-105"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cartItems = Array.isArray(cart?.items) ? cart.items : [];
  const validCartItems = cartItems.filter((item) => item?.product?._id);
  const unavailableItemsCount = cartItems.length - validCartItems.length;
  const isEmpty = validCartItems.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-4xl font-bold">Shopping Cart</h1>
          <EmptyState
            title="Your cart is empty"
            message="Looks like you haven't added any items yet. Start shopping to fill your cart!"
            icon="🛒"
            action={
              <Link
                to="/products"
                className="btn btn-primary transition-all duration-200 hover:scale-105"
              >
                Continue Shopping
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const subtotal = validCartItems.reduce(
    (sum, item) => sum + (item.price || item.product?.price || 0) * (item.quantity || 0),
    0
  );
  const shippingCost = subtotal >= pricing.freeShippingThreshold ? 0 : pricing.shippingCost;
  const tax = subtotal * pricing.taxRate;
  const total = subtotal + shippingCost + tax;
  const freeShippingProgress = Math.min((subtotal / pricing.freeShippingThreshold) * 100, 100);

  return (
    <div className="min-h-screen bg-transparent">
      {/* Scoped keyframes for staggered item load */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .v0-fade-up { animation: fadeUp 0.5s ease-out both; }
      `}</style>

      <div className="container mx-auto px-4 py-8">
        {/* Header — gradient clipped-text title to match brand pages */}
        <div className="v0-fade-up">
          <h1 className="mb-2 bg-linear-to-r from-base-content via-base-content/80 to-base-content bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
            Shopping Cart
          </h1>
          <p className="mb-8 text-base-content/70">
            {validCartItems.length} item{validCartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        {unavailableItemsCount > 0 && (
          <div className="alert alert-warning mb-6 shadow">
            <span>
              {unavailableItemsCount} unavailable item
              {unavailableItemsCount !== 1 ? 's were' : ' was'} hidden because the product no longer
              exists.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="mb-6 space-y-4">
              {validCartItems.map((item, index) => (
                <div
                  key={`${item.product._id}-${index}`}
                  className="v0-fade-up"
                  style={{ animationDelay: `${Math.min(index * 70, 420)}ms` }}
                >
                  <CartItem
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <button
              onClick={handleClearCart}
              className="btn btn-outline btn-error w-full transition-all duration-200 hover:scale-[1.01]"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary Sidebar */}
          <div className="card v0-fade-up sticky top-24 h-fit border border-base-300 bg-base-100 shadow-lg transition-shadow duration-300 hover:shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-6 text-2xl">Order Summary</h2>

              {/* Free Shipping Progress */}
              {subtotal < FREE_SHIPPING_THRESHOLD ? (
                <div className="mb-4 rounded-xl bg-base-200 p-3">
                  <p className="mb-2 text-sm text-base-content/70">
                    Add <span className="font-semibold text-primary">${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}</span> more for free shipping!
                  </p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-base-300">
                    <div
                      className="h-2 rounded-full bg-primary transition-all duration-700 ease-out"
                      style={{ width: `${freeShippingProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 rounded-xl bg-success/10 p-3 text-sm font-semibold text-success">
                  🎉 You&apos;ve unlocked free shipping!
                </div>
              )}

              {/* Summary Items */}
              <div className="space-y-3 border-b border-base-300 pb-4">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>

                {shippingCost > 0 ? (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Shipping:</span>
                    <span className="font-semibold">${shippingCost.toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/70">Shipping:</span>
                    <span className="flex items-center gap-1 font-semibold text-success">Free ✓</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-base-content/70">Tax ({Math.round(TAX_RATE * 100)}%):</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="mb-6 mt-6 flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="btn btn-primary btn-lg mb-2 w-full gap-2 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl hover:ring-2 hover:ring-primary/30"
              >
                Proceed to Checkout →
              </button>

              {/* Continue Shopping Button */}
              <Link
                to="/products"
                className="btn btn-ghost w-full transition-all duration-200 hover:scale-[1.01]"
              >
                Continue Shopping
              </Link>

              {/* Security Badge */}
              <div className="mt-4 flex items-center justify-center gap-1 text-center text-xs text-base-content/50">
                <span>🔒 Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};