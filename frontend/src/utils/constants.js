export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home',
  'Sports',
  'Toys',
];

export const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'PayPal', 'Stripe'];

export const ITEMS_PER_PAGE = 12;

export const TAX_RATE = 0.08;
export const SHIPPING_COST = 10;
