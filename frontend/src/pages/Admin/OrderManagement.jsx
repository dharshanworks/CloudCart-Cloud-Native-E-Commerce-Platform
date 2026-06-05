import { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import { Loader } from '../../components/common/Loader';
import { useToast } from '../../context/ToastContext.jsx';

export const OrderManagement = () => {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getAllOrders();
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      setSelectedOrderId(null);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Order Management</h2>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Order #</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="font-mono text-sm">{order.orderNumber}</td>
                <td>{order.user.name}</td>
                <td className="font-bold">${order.pricing.total.toFixed(2)}</td>
                <td>
                  <span className="badge badge-lg">{order.orderStatus}</span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  {selectedOrderId === order._id ? (
                    <div className="flex gap-2">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="select select-bordered select-sm"
                      >
                        <option value="">Select</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      <button
                        onClick={() => handleStatusUpdate(order._id)}
                        className="btn btn-sm btn-primary"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedOrderId(order._id)}
                      className="btn btn-sm btn-outline"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


