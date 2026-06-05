import api from './axios.js';

export const adminService = {
  /**
   * Get dashboard statistics
   * Returns: totalUsers, totalProducts, totalOrders, completedOrders, totalRevenue, pendingOrders
   */
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  /**
   * Get all users with pagination and filtering
   */
  getAllUsers: async (page = 1, limit = 10, search = '', role = '') => {
    const response = await api.get('/admin/users', {
      params: { page, limit, search, role }
    });
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  /**
   * Update user role
   */
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  /**
   * Suspend user account
   */
  suspendUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/suspend`);
    return response.data;
  },

  /**
   * Delete user permanently
   */
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
};
