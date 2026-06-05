import { useEffect, useState } from 'react';

/**
 * Product Comparison Modal
 * Displays detailed side-by-side comparison of selected products
 * Shows specs, pricing, availability, ratings
 */
export const ProductComparisonModal = ({
  products = [],
  isOpen,
  onClose
}) => {
  const [comparisonProducts, setComparisonProducts] = useState([]);

  useEffect(() => {
    setComparisonProducts(products.slice(0, 4)); // Max 4 products
  }, [products]);

  if (!isOpen || comparisonProducts.length === 0) {
    return null;
  }

  // Extract all unique specification keys from products
  const getAllSpecKeys = () => {
    const keys = new Set();
    comparisonProducts.forEach((product) => {
      if (product.specs) {
        Object.keys(product.specs).forEach((key) => keys.add(key));
      }
    });
    return Array.from(keys);
  };

  const specKeys = getAllSpecKeys();

  // Get comparison attributes
  const getAttribute = (product, key) => {
    if (product.specs && product.specs[key]) {
      return product.specs[key];
    }
    return 'N/A';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex max-h-[90vh] max-w-6xl flex-col overflow-hidden rounded-lg bg-base-100 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-base-200 border-b p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Product Comparison</h2>
            <p className="mt-1 text-sm text-base-content/70">
              Comparing {comparisonProducts.length} products
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-lg"
            aria-label="Close comparison"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="sticky top-0 bg-base-200">
              <tr>
                <th className="w-32 border-r bg-base-200 p-4 text-left font-semibold">
                  Attribute
                </th>
                {comparisonProducts.map((product) => (
                  <th key={product._id} className="p-4 text-center border-r min-w-48">
                    <div className="flex flex-col items-center">
                      <div className="mb-2 h-24 w-24 overflow-hidden rounded bg-base-200">
                        <img
                          src={
                            product.images?.[0] ||
                            'https://via.placeholder.com/200x200?text=No+Image'
                          }
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-semibold text-sm line-clamp-2">
                        {product.name}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Price Row */}
              <tr className="border-b hover:bg-base-200">
                <td className="border-r bg-base-200 p-4 font-semibold">
                  Price
                </td>
                {comparisonProducts.map((product) => (
                  <td
                    key={`${product._id}-price`}
                    className="p-4 text-center border-r"
                  >
                    <span className="text-2xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice > product.price && (
                      <div className="text-sm text-base-content/60 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Rating Row */}
              <tr className="border-b hover:bg-base-200">
                <td className="border-r bg-base-200 p-4 font-semibold">
                  Rating
                </td>
                {comparisonProducts.map((product) => (
                  <td
                    key={`${product._id}-rating`}
                    className="p-4 text-center border-r"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-bold">
                        {(product.rating || 0).toFixed(1)}
                      </span>
                      <span className="text-base-content">★</span>
                      <span className="text-xs text-base-content/70">
                        ({product.reviews?.length || 0} reviews)
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Stock Row */}
              <tr className="border-b hover:bg-base-200">
                <td className="border-r bg-base-200 p-4 font-semibold">
                  Stock
                </td>
                {comparisonProducts.map((product) => (
                  <td
                    key={`${product._id}-stock`}
                    className="p-4 text-center border-r"
                  >
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.stock > 0
                            ? 'bg-base-200 text-base-content'
                            : 'bg-base-200 text-base-content'
                        }`}
                      >
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Brand Row */}
              <tr className="border-b hover:bg-base-200">
                <td className="border-r bg-base-200 p-4 font-semibold">
                  Brand
                </td>
                {comparisonProducts.map((product) => (
                  <td
                    key={`${product._id}-brand`}
                    className="p-4 text-center border-r"
                  >
                    {product.brand || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Category Row */}
              <tr className="border-b hover:bg-base-200">
                <td className="border-r bg-base-200 p-4 font-semibold">
                  Category
                </td>
                {comparisonProducts.map((product) => (
                  <td
                    key={`${product._id}-category`}
                    className="p-4 text-center border-r"
                  >
                    {product.category || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Specifications */}
              {specKeys.map((specKey) => (
                <tr key={specKey} className="border-b hover:bg-base-200">
                  <td className="border-r bg-base-200 p-4 font-semibold capitalize">
                    {specKey}
                  </td>
                  {comparisonProducts.map((product) => (
                    <td
                      key={`${product._id}-${specKey}`}
                      className="p-4 text-center border-r"
                    >
                      {getAttribute(product, specKey)}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Description Row */}
              <tr className="border-b hover:bg-base-200">
                <td className="border-r bg-base-200 p-4 font-semibold">
                  Description
                </td>
                {comparisonProducts.map((product) => (
                  <td
                    key={`${product._id}-desc`}
                    className="p-4 text-center border-r text-sm"
                  >
                    <div className="line-clamp-3">
                      {product.description || 'N/A'}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t bg-base-200 p-4 flex justify-between items-center">
          <p className="text-sm text-base-content/70">
            Max 4 products can be compared at once
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="btn btn-outline btn-sm"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="btn btn-primary btn-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductComparisonModal;
