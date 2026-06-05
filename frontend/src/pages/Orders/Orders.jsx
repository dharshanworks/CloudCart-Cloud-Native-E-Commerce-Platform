import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService.js';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { Breadcrumb } from '../../components/common/Breadcrumb.jsx';

const getStatusBadgeColor = (status) => {
  const statusMap = {
    'pending': 'badge-warning',
    'processing': 'badge-info',
    'shipped': 'badge-primary',
    'delivered': 'badge-success',
    'cancelled': 'badge-error',
  };
  return statusMap[status] || 'badge-gray';
};

const getStatusIcon = (status) => {
  const iconMap = {
    'pending': '⏳',
    'processing': '📦',
    'shipped': '🚚',
    'delivered': '✅',
    'cancelled': '❌',
  };
  return iconMap[status] || '❓';
};

export const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getMyOrders();
      if (response.success) {
        setOrders(response.data.orders || []);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders. Please try again later.');
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Scoped keyframes for staggered card load + subtle header reveal */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .v0-fade-up { animation: fadeUp 0.5s ease-out both; }
      `}</style>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header — gradient clipped-text title to match brand pages */}
        <div className="v0-fade-up mb-8">
          <h1 className="mb-2 bg-linear-to-r from-base-content via-base-content/80 to-base-content bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
            My Orders
          </h1>
          <p className="text-base-content/70">
            View and track your orders
          </p>
        </div>

        {/* Error State */}
        {error && (
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
              onClick={fetchOrders}
              className="btn btn-sm btn-ghost transition-transform duration-200 hover:scale-105"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse border border-base-300 bg-base-100 shadow">
                <div className="card-body">
                  <div className="mb-3 h-6 w-1/4 rounded bg-base-300"></div>
                  <div className="mb-2 h-4 w-1/2 rounded bg-base-300"></div>
                  <div className="h-4 w-2/3 rounded bg-base-300"></div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            title="No Orders Yet"
            message="You haven't placed any orders. Start shopping to create your first order!"
            icon="🛍️"
            action={
              <button
                onClick={() => navigate('/products')}
                className="btn btn-primary transition-all duration-200 hover:scale-105"
              >
                Browse Products
              </button>
            }
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <div
                key={order._id}
                onClick={() => navigate(`/orders/${order._id}`)}
                style={{ animationDelay: `${Math.min(i * 80, 480)}ms` }}
                className="card v0-fade-up group cursor-pointer border border-base-300 bg-base-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                <div className="card-body">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="card-title text-lg md:text-xl">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <span className={`badge ${getStatusBadgeColor(order.orderStatus)} transition-transform duration-200 group-hover:scale-105`}>
                          {getStatusIcon(order.orderStatus)} {order.orderStatus}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-base-content/70">
                        <p>
                          <strong>Date:</strong>{' '}
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p>
                          <strong>Items:</strong> {order.items?.length || 0} item(s)
                        </p>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="md:text-right">
                      <p className="mb-1 text-sm text-base-content/70">Total Amount</p>
                      <p className="text-2xl font-bold text-primary md:text-3xl">
                        ${(order.totalPrice || 0).toFixed(2)}
                      </p>
                      <button className="btn btn-sm btn-outline mt-3 w-full transition-all duration-200 group-hover:btn-primary group-hover:scale-[1.02] md:w-auto">
                        View Details →
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 border-t border-base-300 pt-4">
                    <div className="mb-2 flex justify-between text-xs text-base-content/60">
                      <span>Order Status</span>
                      <span className="capitalize">{order.orderStatus}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-base-200">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ease-out ${
                          order.orderStatus === 'pending' ? 'w-1/4 bg-warning' :
                          order.orderStatus === 'processing' ? 'w-2/4 bg-info' :
                          order.orderStatus === 'shipped' ? 'w-3/4 bg-primary' :
                          order.orderStatus === 'delivered' ? 'w-full bg-success' :
                          'w-full bg-error'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};