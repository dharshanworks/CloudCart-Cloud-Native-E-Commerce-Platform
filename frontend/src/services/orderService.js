import api from './axios.js';

export const orderService = {
  createOrder: async (shippingDetails, paymentDetails) => {
    const response = await api.post('/orders', {
      shippingDetails,
      paymentDetails,
    });
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, orderStatus) => {
    const response = await api.put(`/orders/${id}/status`, { orderStatus });
    return response.data;
  },

  cancelOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
};
