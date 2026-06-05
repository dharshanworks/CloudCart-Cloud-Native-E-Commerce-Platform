import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService.js';
import { CartContext } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Breadcrumb } from '../../components/common/Breadcrumb.jsx';

const getStockStatus = (stock) => {
  if (stock === 0) return { text: 'Out of Stock', color: 'error', badge: 'badge-error' };
  if (stock < 5) return { text: `Only ${stock} left`, color: 'warning', badge: 'badge-warning' };
  return { text: 'In Stock', color: 'success', badge: 'badge-success' };
};

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getById(id);
      if (response.success) {
        setProduct(response.data.product);
        setSelectedImage(0);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product details');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(id, quantity);
      toast.success(`${quantity} item(s) added to cart!`);
      // Reset quantity after successful add
      setQuantity(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
      console.error('Add to cart error:', err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (value) => {
    const num = parseInt(value) || 1;
    if (num < 1) return;
    if (num > product.stock) {
      setQuantity(product.stock);
      return;
    }
    setQuantity(num);
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 animate-pulse rounded-lg bg-base-300"></div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-base-300"></div>
              <div className="h-6 w-1/2 animate-pulse rounded bg-base-300"></div>
              <div className="h-10 w-1/3 animate-pulse rounded bg-base-300"></div>
              <div className="space-y-2">
                <div className="h-4 animate-pulse rounded bg-base-300"></div>
                <div className="h-4 animate-pulse rounded bg-base-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="container mx-auto px-4 py-8">
          <div className="card border border-base-300 bg-base-100 shadow-lg">
            <div className="card-body text-center">
              <h2 className="card-title mb-4 justify-center text-2xl">
                {error ? '❌ Error' : '🔍 Product Not Found'}
              </h2>
              <p className="mb-6 text-base-content/70">
                {error || 'The product you are looking for does not exist.'}
              </p>
              <div className="flex gap-3">
                <button onClick={fetchProduct} className="btn btn-primary">
                  Try Again
                </button>
                <button onClick={() => navigate('/products')} className="btn btn-ghost">
                  Back to Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const mainImage = images[selectedImage] || 'https://via.placeholder.com/500x500?text=No+Image';
  const stockStatus = getStockStatus(product.stock);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-transparent">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="group relative overflow-hidden rounded-lg bg-base-200">
              <img
                src={mainImage}
                alt={product.name}
                className="h-96 w-full object-cover transition duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                }}
              />
              {discount > 0 && (
                <div className="absolute right-4 top-4 rounded-full bg-error px-3 py-1 font-bold text-error-content">
                  -{discount}%
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      selectedImage === idx ? 'border-primary' : 'border-base-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=Image';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center gap-2">
                {product.brand && (
                  <span className="badge badge-outline">{product.brand}</span>
                )}
                <span className="badge badge-primary">{product.category}</span>
              </div>
              <h1 className="mb-2 text-3xl font-bold md:text-4xl">{product.name}</h1>

              {product.rating && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex text-base-content">
                    {'⭐'.repeat(Math.round(product.rating))}
                  </div>
                  <span className="text-sm text-base-content/70">
                    {product.rating.toFixed(1)} ({product.reviews?.length || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary md:text-4xl">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-base-content/50 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className={`badge badge-lg ${stockStatus.badge} capitalize text-white`}>
                {stockStatus.text}
              </span>
            </div>

            <p className="leading-relaxed text-base-content/80">{product.description}</p>

            <div>
              <label className="mb-3 block text-sm font-semibold">Select Quantity:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="btn btn-outline btn-sm"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="input input-bordered input-sm w-20 text-center"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="btn btn-outline btn-sm"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              className="btn btn-primary btn-lg w-full gap-2"
            >
              {isAddingToCart ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Adding...
                </>
              ) : (
                <>
                  🛒 Add to Cart
                </>
              )}
            </button>

            <div className="card border border-base-300 bg-base-200/70">
              <div className="card-body space-y-3">
                <h3 className="card-title text-lg">Product Details</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="font-semibold">Category:</span>
                    <span>{product.category}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-semibold">Brand:</span>
                    <span>{product.brand || 'N/A'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-semibold">Stock Available:</span>
                    <span>{product.stock} units</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-semibold">SKU:</span>
                    <span className="font-mono text-xs">{product._id.slice(-6).toUpperCase()}</span>
                  </li>
                </ul>
                <div className="divider my-2"></div>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span>🚚</span>
                    <span>Free Shipping on orders over $100</span>
                  </li>
                  <li className="flex gap-2">
                    <span>↩️</span>
                    <span>30-day money-back guarantee</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✅</span>
                    <span>2-year warranty included</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
