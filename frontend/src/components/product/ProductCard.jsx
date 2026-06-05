import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../../context/CartContext.jsx';

/**
 * Enhanced Product Card Component
 * Grid view display with quick view, compare, and cart actions
 * Supports product images, ratings, badges, and stock status
 */
export const ProductCard = ({ product, onQuickView, onCompare }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, 1);
      alert('Added to cart!');
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart');
    }
  };

  // Determine stock status color and text
  const getStockStatus = () => {
    if (product.stock === 0) {
      return {
        color: 'text-base-content bg-base-200',
        text: 'Out of Stock',
        badge: 'badge-ghost'
      };
    } else if (product.stock < 5) {
      return {
        color: 'text-base-content bg-base-200',
        text: `Only ${product.stock} left`,
        badge: 'badge-ghost'
      };
    } else {
      return {
        color: 'text-base-content bg-base-200',
        text: 'In Stock',
        badge: 'badge-ghost'
      };
    }
  };

  const stockStatus = getStockStatus();

  // Calculate discount percentage
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  return (
    <div className="card group border border-base-300 bg-base-100 shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      {/* Image Section */}
      <figure className="relative h-48 overflow-hidden rounded-lg bg-base-200 px-4 pt-4">
        <img
          src={
            product.images?.[0] ||
            `https://images.unsplash.com/photo-${Math.abs(product._id?.charCodeAt(0) || 1) % 10 === 0 ? '1505740420928' : '1505740420928'}-5e560c06d30e?w=400&h=300&fit=crop`
          }
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop';
          }}
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 rounded-full bg-error px-2 py-1 text-sm font-bold text-error-content">
            -{discount}%
          </div>
        )}

        {/* Stock badge */}
        {product.stock < 5 && product.stock > 0 && (
          <div className={`badge badge-sm ${stockStatus.badge} absolute top-2 left-2`}>
            {product.stock < 5 ? `${product.stock} left` : ''}
          </div>
        )}

        {/* Quick View Button - Shows on Hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition duration-300 group-hover:bg-black/30 group-hover:opacity-100">
          <button
            onClick={() => onQuickView?.(product)}
            className="btn btn-primary btn-sm"
          >
            👁️ Quick View
          </button>
        </div>
      </figure>

      {/* Content Section */}
      <div className="card-body">
        {/* Brand and Category */}
        <div className="flex justify-between items-start gap-2 mb-1">
          <div className="flex gap-1 flex-wrap">
            {product.brand && (
              <span className="badge badge-outline text-xs">
                {product.brand}
              </span>
            )}
            {product.category && (
              <span className="badge badge-primary text-xs">
                {product.category}
              </span>
            )}
          </div>
        </div>

        {/* Product name */}
        <h2 className="card-title text-lg line-clamp-2 min-h-14">
          {product.name}
        </h2>

        {/* Description */}
        {product.description && (
          <p className="line-clamp-2 text-sm text-base-content/70">
            {product.description}
          </p>
        )}

        {/* Price and stock row */}
        <div className="flex justify-between items-start mt-3 pt-2 border-t gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">
                ${product.price?.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-base-content/50 line-through">
                  ${product.originalPrice?.toFixed(2)}
                </span>
              )}
            </div>
            {product.rating && product.rating > 0 && (
              <span className="text-xs font-semibold text-base-content">
                ⭐ {product.rating.toFixed(1)} ({product.reviews?.length || 0})
              </span>
            )}
          </div>

          <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${stockStatus.color}`}>
            {stockStatus.text}
          </span>
        </div>

        {/* Action buttons */}
        <div className="card-actions mt-4 flex-wrap gap-2">
          <button
            onClick={() => onCompare?.(product)}
            className="btn btn-sm btn-outline btn-square"
            title="Add to comparison"
          >
            ⚖️
          </button>

          <Link
            to={`/products/${product._id}`}
            className="btn btn-sm btn-outline flex-1 hover:btn-primary"
          >
            Details
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn btn-sm btn-primary flex-1"
          >
            {product.stock === 0 ? 'Unavailable' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};
