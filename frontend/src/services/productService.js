import api from './axios.js';

export const productService = {
  /**
   * Get all products with optional pagination
   */
  getAll: async (page = 1, limit = 12) => {
    const response = await api.get('/products', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Search products across name, brand, description
   */
  search: async (query = '', page = 1, limit = 12) => {
    const response = await api.get('/products', {
      params: { search: query, page, limit },
    });
    return response.data;
  },

  /**
   * Filter products by category
   */
  filterByCategory: async (category = '', page = 1, limit = 12) => {
    if (!category) {
      return productService.getAll(page, limit);
    }
    
    const response = await api.get(`/products/category/${category}`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Search and filter combined
   * First applies category filter, then search
   */
  searchAndFilter: async (query = '', category = '', page = 1, limit = 12) => {
    let params = { page, limit };
    let url = '/products';
    
    if (query) {
      params.search = query;
    }
    
    if (category) {
      url = `/products/category/${category}`;
    }
    
    const response = await api.get(url, { params });
    return response.data;
  },

  /**
   * Get single product by ID
   */
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  /**
   * Get all available categories
   */
  getCategories: async () => {
    const response = await api.get('/products/categories/list');
    return response.data;
  },

  /**
   * Upload product images (admin only)
   */
  uploadImages: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    
    const response = await api.post('/products/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
