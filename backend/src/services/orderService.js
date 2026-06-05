import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { AppError } from '../middleware/errorMiddleware.js';
import { PRICING } from '../utils/constants.js';

/**
 * Order Service
 * Handles all order business logic
 */

export const createOrder = async (userId, orderData) => {
  // Validate order data
  if (!orderData?.shippingDetails?.name || !orderData?.shippingDetails?.address) {
    throw new AppError('Shipping details are required', 400);
  }

  if (!orderData?.paymentDetails?.method) {
    throw new AppError('Payment method is required', 400);
  }

  // Get user's cart
  const cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty. Cannot create order', 400);
  }

  // Verify all products are still available and in stock
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);

    if (!product || !product.isActive) {
      throw new AppError(`Product ${item.product.name} is no longer available`, 400);
    }

    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}. Available: ${product.stock}`, 400);
    }
  }

  // Create order items array
  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    productName: item.product.name,
    quantity: item.quantity,
    price: item.price
  }));

  // Calculate pricing using constants
  const subtotal = cart.totalPrice;
  const shippingCost = subtotal >= PRICING.FREE_SHIPPING_THRESHOLD ? 0 : PRICING.DEFAULT_SHIPPING_COST;
  const tax = Math.round(subtotal * PRICING.DEFAULT_TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;

  // Create order
  const count = await Order.countDocuments();

  const order = await Order.create({
    user: userId,
    orderNumber: `ORD-${Date.now()}-${count + 1}`,
    items: orderItems,
    shippingDetails: orderData.shippingDetails,
    paymentDetails: orderData.paymentDetails,
    pricing: {
      subtotal,
      shippingCost,
      tax,
      total
    }
  });

  // Reduce product stock atomically
  for (const item of cart.items) {
    const result = await Product.updateOne(
      { 
        _id: item.product._id,
        stock: { $gte: item.quantity } // Ensure enough stock before decrementing
      },
      { $inc: { stock: -item.quantity } }
    );
    
    if (result.modifiedCount === 0) {
      throw new AppError(`Insufficient stock for ${item.product.name}. Please try again.`, 400);
    }
  }

  // Clear cart
  await cart.clearCart();

  // Populate and return
  await order.populate('user', 'name email phone');
  await order.populate('items.product');

  return order.getSafeData();
};

export const getOrder = async (orderId, userId = null) => {
  const order = await Order.findById(orderId)
    .populate('user', 'name email phone')
    .populate('items.product');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // If userId provided, verify ownership
  if (userId && order.user._id.toString() !== userId.toString()) {
    throw new AppError('You do not have permission to view this order', 403);
  }

  return order.getSafeData();
};

export const getUserOrders = async (userId) => {
  const orders = await Order.findUserOrders(userId);

  if (!orders) {
    return [];
  }

  return orders.map((order) => order.getSafeData());
};

export const getAllOrders = async () => {
  const orders = await Order.findAllOrders();
  return orders.map((order) => order.getSafeData());
};

export const updateOrderStatus = async (orderId, newStatus, adminId = null) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Validate status transition
  const validTransitions = {
    'Pending': ['Processing', 'Cancelled'],
    'Processing': ['Shipped', 'Cancelled'],
    'Shipped': ['Delivered', 'Cancelled'],
    'Delivered': [],
    'Cancelled': []
  };

  if (!validTransitions[order.orderStatus]?.includes(newStatus)) {
    throw new AppError(
      `Cannot transition from ${order.orderStatus} to ${newStatus}`,
      400
    );
  }

  order.orderStatus = newStatus;

  // Update estimated delivery if shipped
  if (newStatus === 'Shipped' && !order.estimatedDelivery) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7); // 7 days delivery time
    order.estimatedDelivery = deliveryDate;
  }

  await order.save();
  await order.populate('user', 'name email phone');
  await order.populate('items.product');

  return order.getSafeData();
};

export const getOrderByNumber = async (orderNumber, userId = null) => {
  const order = await Order.findByOrderNumber(orderNumber);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // If userId provided, verify ownership
  if (userId && order.user._id.toString() !== userId.toString()) {
    throw new AppError('You do not have permission to view this order', 403);
  }

  return order.getSafeData();
};

export const cancelOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Verify ownership
  if (order.user.toString() !== userId.toString()) {
    throw new AppError('You do not have permission to cancel this order', 403);
  }

  // Can only cancel pending or processing orders
  if (!['Pending', 'Processing'].includes(order.orderStatus)) {
    throw new AppError(`Cannot cancel order with status: ${order.orderStatus}`, 400);
  }

  // Restore product stock
  for (const item of order.items) {
    await Product.updateOne(
      { _id: item.product },
      { $inc: { stock: item.quantity } }
    );
  }

  order.orderStatus = 'Cancelled';
  await order.save();
  await order.populate('user', 'name email phone');
  await order.populate('items.product');

  return order.getSafeData();
};
