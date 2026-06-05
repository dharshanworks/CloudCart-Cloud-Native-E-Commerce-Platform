import mongoose from 'mongoose';

/**
 * Order Schema
 * Represents customer orders with products, shipping, and payment info
 */
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    orderNumber: {
      type: String,
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
        productName: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true,
          min: 0
        },
        _id: false
      }
    ],
    shippingDetails: {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      address: {
        street: {
          type: String,
          required: true
        },
        city: {
          type: String,
          required: true
        },
        state: {
          type: String,
          required: true
        },
        postalCode: {
          type: String,
          required: true
        },
        country: {
          type: String,
          required: true
        }
      }
    },
    paymentDetails: {
      method: {
        type: String,
        enum: ['Credit Card', 'Debit Card', 'PayPal', 'Stripe', 'Other'],
        required: true
      },
      status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
      },
      transactionId: String
    },
    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: 0
      },
      shippingCost: {
        type: Number,
        default: 0,
        min: 0
      },
      tax: {
        type: Number,
        default: 0,
        min: 0
      },
      total: {
        type: Number,
        required: true,
        min: 0
      }
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
      index: true
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    notes: String
  },
  {
    timestamps: true
  }
);

// Generate order number before saving
orderSchema.pre('save', async function () {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    const timestamp = Date.now().toString().slice(-6);
    this.orderNumber = `ORD-${timestamp}-${count + 1}`;
  }
});

// Instance methods
orderSchema.methods.getSafeData = function () {
  return {
    _id: this._id,
    user: this.user,
    orderNumber: this.orderNumber,
    items: this.items,
    shippingDetails: this.shippingDetails,
    paymentDetails: this.paymentDetails,
    pricing: this.pricing,
    orderStatus: this.orderStatus,
    trackingNumber: this.trackingNumber,
    estimatedDelivery: this.estimatedDelivery,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Static methods
orderSchema.statics.findByOrderNumber = function (orderNumber) {
  return this.findOne({ orderNumber }).populate('user', 'name email phone').populate('items.product');
};

orderSchema.statics.findUserOrders = function (userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 }).populate('items.product');
};

orderSchema.statics.findAllOrders = function () {
  return this.find().sort({ createdAt: -1 }).populate('user', 'name email').populate('items.product');
};

export default mongoose.model('Order', orderSchema);
