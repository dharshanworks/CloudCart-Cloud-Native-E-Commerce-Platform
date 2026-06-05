import { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext.jsx';

/**
 * Product Quick View Modal
 * Shows detailed product information in a modal
 * Allows quick add-to-cart without navigating to product page
 */
export const ProductQuickViewModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen || !product) {
    return null;
  }

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      await addToCart(product._id, quantity);
      onAddToCart?.();
      // Show success message
      const confirmAdd = confirm(`${quantity} x ${product.name} added to cart!`);
      if (confirmAdd) {
        onClose();
        setQuantity(1);
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const images = product.images || [
    'https://via.placeholder.com/400x400?text=No+Image'
  ];

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-base-100 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 btn btn-ghost btn-circle z-10"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
          {/* Left Side - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative h-96 overflow-hidden rounded-lg bg-base-200">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {discount > 0 && (
                <div className="absolute right-4 top-4 rounded-full bg-base-300 px-3 py-1 text-sm font-bold text-base-content">
                  -{discount}%
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-white font-bold text-xl">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`rounded-lg overflow-hidden h-20 border-2 transition ${
                      selectedImage === idx
                        ? 'border-primary'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Product ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Details */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
              {product.brand && (
                <p className="text-sm text-base-content/70">
                  Brand: <span className="font-semibold">{product.brand}</span>
                </p>
              )}
              {product.category && (
                <p className="text-sm text-base-content/70">
                  Category:{' '}
                  <span className="font-semibold">{product.category}</span>
                </p>
              )}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-base-content">
                    {'★'.repeat(Math.floor(product.rating))}
                  </span>
                </div>
                <span className="text-sm text-base-content/70">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>
            )}

            <div className="divider my-2" />

            {/* Price */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-base-content/60 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-semibold text-base-content">
                You save ${(product.originalPrice - product.price).toFixed(2)}
              </p>
            </div>

            {/* Stock Status */}
            <div>
              <p className="text-sm font-semibold mb-2">Availability:</p>
              <div
                className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${
                  product.stock > 0
                    ? 'bg-base-200 text-base-content'
                    : 'bg-base-200 text-base-content'
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} In Stock`
                  : 'Out of Stock'}
              </div>
              {product.stock > 0 && product.stock < 5 && (
                <p className="mt-2 text-xs text-base-content">
                  Only {product.stock} left - Order soon!
                </p>
              )}
            </div>

            <div className="divider my-2" />

            {/* Description */}
            {product.description && (
              <div>
                <p className="text-sm font-semibold mb-2">Description:</p>
                <p className="text-sm text-base-content/70">{product.description}</p>
              </div>
            )}

            {/* Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-2">Specifications:</p>
                <div className="space-y-1">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between border-b pb-1 text-sm text-base-content/70"
                    >
                      <span className="font-medium capitalize">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="divider my-2" />

            {/* Quantity and Add to Cart */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Quantity:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    disabled={product.stock === 0}
                    className="input input-bordered input-sm w-20 text-center"
                  />
                  <span className="text-sm text-base-content/70">
                    of {product.stock} available
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding}
                className="btn btn-primary w-full"
              >
                {isAdding ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Adding...
                  </>
                ) : product.stock === 0 ? (
                  'Out of Stock'
                ) : (
                  '🛒 Add to Cart'
                )}
              </button>

              <button
                onClick={onClose}
                className="btn btn-outline w-full"
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
