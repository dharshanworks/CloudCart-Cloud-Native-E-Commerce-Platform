import mongoose from 'mongoose';

/**
 * Cart Schema
 * Represents shopping cart for each user
 * Stores references to products with quantities
 */
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
          default: 1
        },
        price: {
          type: Number,
          required: true,
          min: [0, 'Price cannot be negative']
        },
        _id: false
      }
    ],
    totalPrice: {
      type: Number,
      default: 0,
      min: [0, 'Total price cannot be negative']
    },
    totalItems: {
      type: Number,
      default: 0,
      min: [0, 'Total items cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

// Calculate totals before saving
cartSchema.pre('save', function () {
  this.totalItems = this.items.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  this.totalPrice = this.items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  this.totalPrice = Math.round(this.totalPrice * 100) / 100;
});

// Instance methods
cartSchema.methods.addItem = function (productId, quantity, price) {
  const existingItem = this.items.find((item) => item.product.toString() === productId.toString());

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({ product: productId, quantity, price });
  }

  return this.save();
};

cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter((item) => item.product.toString() !== productId.toString());
  return this.save();
};

cartSchema.methods.updateQuantity = function (productId, quantity) {
  const item = this.items.find((item) => item.product.toString() === productId.toString());

  if (item) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    item.quantity = quantity;
    return this.save();
  }

  return Promise.resolve(this);
};

cartSchema.methods.clearCart = function () {
  this.items = [];
  return this.save();
};

cartSchema.methods.getSafeData = function () {
  return {
    _id: this._id,
    user: this.user,
    items: this.items,
    totalPrice: this.totalPrice,
    totalItems: this.totalItems,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Static methods
cartSchema.statics.findOrCreateCart = async function (userId) {
  let cart = await this.findOne({ user: userId }).populate('items.product');

  if (!cart) {
    cart = await this.create({ user: userId, items: [] });
  }

  return cart;
};

export default mongoose.model('Cart', cartSchema);
