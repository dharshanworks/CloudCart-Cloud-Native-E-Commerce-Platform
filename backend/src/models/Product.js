import mongoose from 'mongoose';

/**
 * Product Schema
 * Represents products in the CloudCart e-commerce platform
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters'],
      index: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Electronics',
          'Fashion',
          'Home & Garden',
          'Sports & Outdoors',
          'Books',
          'Toys & Games',
          'Health & Beauty',
          'Automotive',
          'Food & Groceries',
          'Other'
        ],
        message: 'Invalid category selected'
      },
      index: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      max: [999999, 'Price cannot exceed 999999']
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'At least one image URL is required'
      },
      default: []
    },
    primaryImage: {
      type: String,
      default: null
    },
    ratings: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    numReviews: {
      type: Number,
      default: 0,
      min: [0, 'Number of reviews cannot be negative']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for discounted price (future use)
productSchema.virtual('discount').get(function () {
  return 0; // Can be calculated based on promotions later
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ createdBy: 1, isActive: 1 });

// Instance methods
productSchema.methods.getSafeData = function () {
  const { __v, ...safe } = this.toObject();
  return safe;
};

// Static methods
productSchema.statics.findByCategory = function (category) {
  return this.find({ category, isActive: true });
};

productSchema.statics.findInPriceRange = function (minPrice, maxPrice) {
  return this.find({
    price: { $gte: minPrice, $lte: maxPrice },
    isActive: true
  });
};

export default mongoose.model('Product', productSchema);
