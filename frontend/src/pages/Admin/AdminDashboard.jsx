import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService.js';
import { useToast } from '../../context/ToastContext.jsx';
import { OrderManagement } from './OrderManagement';

export const AdminDashboard = () => {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getDashboardStats();
      
      if (response.success) {
        setStats(response.data.stats);
      } else {
        setError('Failed to fetch dashboard stats');
        toast.error('Failed to load dashboard statistics');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch dashboard stats';
      setError(message);
      toast.error(message);
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card bg-base-200 animate-pulse">
              <div className="card-body">
                <div className="h-4 w-2/3 rounded bg-base-300"></div>
                <div className="h-8 w-1/2 rounded bg-base-300 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <div className="alert alert-error">
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
          <span>{error || 'Failed to load dashboard'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card bg-primary text-white shadow hover:shadow-lg transition-shadow">
          <div className="card-body">
            <h3 className="text-sm font-semibold">Total Orders</h3>
            <p className="text-3xl font-bold">{(stats?.totalOrders || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="card bg-success text-white shadow hover:shadow-lg transition-shadow">
          <div className="card-body">
            <h3 className="text-sm font-semibold">Delivered</h3>
            <p className="text-3xl font-bold">{(stats?.completedOrders || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="card bg-warning text-white shadow hover:shadow-lg transition-shadow">
          <div className="card-body">
            <h3 className="text-sm font-semibold">In Transit</h3>
            <p className="text-3xl font-bold">
              {(stats?.totalOrders - stats?.completedOrders || 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="card bg-info text-white shadow hover:shadow-lg transition-shadow">
          <div className="card-body">
            <h3 className="text-sm font-semibold">Total Revenue</h3>
            <p className="text-3xl font-bold">${(stats?.totalRevenue || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <OrderManagement />
        </div>
      </div>
    </div>
  );
};


