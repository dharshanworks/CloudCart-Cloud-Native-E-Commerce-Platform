import api from './axios.js';

export const configService = {
  /**
   * Fetch pricing config (tax rate, shipping cost, free shipping threshold)
   */
  getPricing: async () => {
    const res = await api.get('/config/pricing');
    return res.data;
  },
};
