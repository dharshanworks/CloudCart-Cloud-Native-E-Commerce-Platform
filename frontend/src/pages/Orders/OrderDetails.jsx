import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService.js';
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

const getStatusSteps = (status) => {
  const steps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = steps.indexOf(status);
  return steps.map((step, idx) => ({
    step,
    completed: idx <= currentIndex,
    current: idx === currentIndex,
  }));
};

export const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getOrderById(id);
      if (response.success) {
        setOrder(response.data.order);
      } else {
        setError('Failed to fetch order');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order details.');
      console.error('Failed to fetch order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setCancelLoading(true);
    try {
      await orderService.cancelOrder(id);
      fetchOrder();
      alert('Order cancelled successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="container mx-auto px-4 py-8">
          <div className="card animate-pulse border border-base-300 bg-base-100 shadow">
            <div className="card-body">
              <div className="mb-4 h-8 w-1/3 rounded bg-base-300"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 w-2/3 rounded bg-base-300"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="container mx-auto px-4 py-8">
          <div className="alert alert-error shadow-lg">
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
              <div className="text-sm">{error || 'Order not found'}</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className="btn btn-primary mt-4 transition-all duration-200 hover:scale-105"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps(order.orderStatus);

  return (
    <div className="min-h-screen bg-transparent">
      {/* Scoped keyframes for staggered card load */}
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
        <div className="v0-fade-up mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 bg-linear-to-r from-base-content via-base-content/80 to-base-content bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-base-content/70">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <span className={`badge badge-lg ${getStatusBadgeColor(order.orderStatus)}`}>
            {order.orderStatus.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Order Status Timeline — connected vertical track */}
            <div className="card v0-fade-up border border-base-300 bg-base-100 shadow-md transition-shadow duration-300 hover:shadow-lg">
              <div className="card-body">
                <h2 className="card-title mb-6">Order Status</h2>
                <div className="relative space-y-6">
                  {statusSteps.map((item, idx) => (
                    <div key={item.step} className="relative flex items-start gap-4">
                      {/* Connector line between steps */}
                      {idx < statusSteps.length - 1 && (
                        <span
                          className={`absolute left-4 top-9 h-[calc(100%+0.5rem)] w-0.5 -translate-x-1/2 transition-colors duration-500 ${
                            statusSteps[idx + 1].completed ? 'bg-success' : 'bg-base-300'
                          }`}
                          aria-hidden="true"
                        ></span>
                      )}
                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-white transition-all duration-500 ${
                          item.completed ? 'bg-success' : 'bg-base-300'
                        } ${item.current ? 'ring-4 ring-success/20' : ''}`}
                      >
                        {item.completed ? '✓' : idx + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className={`font-semibold capitalize ${item.current ? 'text-success' : ''}`}>
                          {item.step}
                        </p>
                        <p className="text-sm text-base-content/70">
                          {item.step === 'pending' && 'Your order is being prepared'}
                          {item.step === 'processing' && 'Your order is being processed'}
                          {item.step === 'shipped' && 'Your order is on its way'}
                          {item.step === 'delivered' && 'Your order has been delivered'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="card v0-fade-up border border-base-300 bg-base-100 shadow-md transition-shadow duration-300 hover:shadow-lg" style={{ animationDelay: '80ms' }}>
              <div className="card-body">
                <h2 className="card-title mb-6">Order Items</h2>
                <div className="space-y-4">
                  {order.items?.map((item) => (
                    <div
                      key={item._id}
                      className="group flex gap-4 rounded-xl border-b border-base-200 p-2 transition-colors duration-200 last:border-b-0 hover:bg-base-200/50"
                    >
                      <img
                        src={item.product?.primaryImage || 'https://via.placeholder.com/100x100?text=Product'}
                        alt={item.product?.name}
                        className="h-24 w-24 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=Product';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{item.product?.name}</h3>
                        <p className="mb-1 text-sm text-base-content/70">
                          Category: {item.product?.category}
                        </p>
                        <p className="text-sm text-base-content/70">
                          Quantity: <span className="font-semibold">{item.quantity}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="mb-1 text-sm text-base-content/70">Price</p>
                        <p className="text-lg font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="card v0-fade-up border border-base-300 bg-base-100 shadow-md transition-shadow duration-300 hover:shadow-lg" style={{ animationDelay: '120ms' }}>
              <div className="card-body">
                <h2 className="card-title mb-6">Order Summary</h2>
                <div className="space-y-3">
                   <div className="flex justify-between">
                     <span className="text-base-content/70">Subtotal:</span>
                     <span className="font-semibold">
                       ${(order.pricing?.subtotal || 0).toFixed(2)}
                     </span>
                   </div>
                   {(order.pricing?.tax || 0) > 0 && (
                     <div className="flex justify-between">
                       <span className="text-base-content/70">Tax:</span>
                       <span className="font-semibold">${(order.pricing?.tax || 0).toFixed(2)}</span>
                     </div>
                   )}
                   <div className="flex justify-between">
                     <span className="text-base-content/70">Shipping:</span>
                     <span className="font-semibold">${(order.pricing?.shippingCost || 0).toFixed(2)}</span>
                   </div>
                   <div className="divider my-2"></div>
                   <div className="flex justify-between text-lg font-bold">
                     <span>Total:</span>
                     <span className="text-primary">${(order.pricing?.total || 0).toFixed(2)}</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="card v0-fade-up border border-base-300 bg-base-100 shadow-md transition-shadow duration-300 hover:shadow-lg" style={{ animationDelay: '160ms' }}>
              <div className="card-body">
                <h2 className="card-title mb-6">Shipping Address</h2>
                <address className="space-y-1 not-italic text-base-content/70">
                  <p className="font-semibold">{order.shippingDetails?.name}</p>
                  <p>{order.shippingDetails?.address?.street}</p>
                  <p>
                    {order.shippingDetails?.address?.city}, {order.shippingDetails?.address?.state}{' '}
                    {order.shippingDetails?.address?.postalCode}
                  </p>
                  <p>{order.shippingDetails?.address?.country}</p>
                </address>
              </div>
            </div>

            {/* Payment Details */}
            <div className="card v0-fade-up border border-base-300 bg-base-100 shadow-md transition-shadow duration-300 hover:shadow-lg" style={{ animationDelay: '200ms' }}>
              <div className="card-body">
                <h2 className="card-title mb-6">Payment Method</h2>
                <p className="mb-2 capitalize text-base-content/70">
                  {order.paymentDetails?.method || 'N/A'}
                </p>
                {order.paymentDetails?.transactionId && (
                  <p className="text-sm text-base-content/50">
                    Transaction ID: <br /> {order.paymentDetails.transactionId}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelLoading}
                  className="btn btn-outline btn-error w-full transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100"
                >
                  {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
              <button
                onClick={() => navigate('/orders')}
                className="btn btn-ghost w-full transition-all duration-200 hover:scale-[1.02]"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};