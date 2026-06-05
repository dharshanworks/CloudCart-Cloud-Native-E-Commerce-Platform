import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { AppError } from '../middleware/errorMiddleware.js';

/**
 * Cart Service
 * Handles all cart business logic
 */

export const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await cart.populate('items.product');
  }

  return cart;
};

const removeUnavailableItems = (cart) => {
  const originalLength = cart.items.length;
  cart.items = cart.items.filter((item) => {
    // Keep item if it has a valid product reference (populated or ObjectId)
    const hasProductRef = item?.product?._id || item?.product;
    // Also ensure the item has valid quantity and price
    const hasValidData = item?.quantity > 0 && item?.price >= 0;
    return hasProductRef && hasValidData;
  });
  return cart.items.length !== originalLength;
};

export const addToCart = async (userId, productId, quantity) => {
  // Verify product exists and is active
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (!product.isActive) {
    throw new AppError('Product is no longer available', 404);
  }

  // Check stock availability
  if (product.stock < quantity) {
    throw new AppError(`Only ${product.stock} items available in stock`, 400);
  }

  // Get or create cart
  let cart = await getOrCreateCart(userId);

  // Cleanup stale cart rows where product was deleted
  const removedUnavailableItems = removeUnavailableItems(cart);

  // Check if product already in cart
  const existingItem = cart.items.find((item) => {
    const currentProductId = item?.product?._id || item?.product;
    return currentProductId?.toString() === productId.toString();
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (product.stock < newQuantity) {
      throw new AppError(`Only ${product.stock} items available in stock`, 400);
    }
    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price
    });
  }

  await cart.save();
  cart = await cart.populate('items.product');

  return cart.getSafeData();
};

export const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  const removedUnavailableItems = removeUnavailableItems(cart);

  if (removedUnavailableItems) {
    await cart.save();
    await cart.populate('items.product');
  }

  return cart.getSafeData();
};

export const removeFromCart = async (userId, productId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  const initialLength = cart.items.length;

  cart.items = cart.items.filter((item) => {
    const currentProductId = item?.product?._id || item?.product;
    if (!currentProductId) {
      return false;
    }

    return currentProductId.toString() !== productId.toString();
  });

  if (cart.items.length === initialLength) {
    throw new AppError('Product not found in cart', 404);
  }

  await cart.save();

  cart = await cart.populate('items.product');

  return cart.getSafeData();
};

export const updateCartQuantity = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  // Check if product in cart
  const item = cart.items.find((item) => {
    const currentProductId = item?.product?._id || item?.product;
    return currentProductId?.toString() === productId.toString();
  });

  if (!item) {
    throw new AppError('Product not found in cart', 404);
  }

  // Verify product stock
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (product.stock < quantity) {
    throw new AppError(`Only ${product.stock} items available in stock`, 400);
  }

  // Update quantity
  await cart.updateQuantity(productId, quantity);
  await cart.populate('items.product');

  return cart.getSafeData();
};

export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  await cart.clearCart();

  return { message: 'Cart cleared successfully' };
};
