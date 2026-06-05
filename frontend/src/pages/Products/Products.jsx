import { useEffect, useState, useCallback, useRef } from 'react';
import { productService } from '../../services/productService.js';
import { ProductCard } from '../../components/product/ProductCard.jsx';
import { ProductListCard } from '../../components/product/ProductListCard.jsx';
import { ProductGridSkeleton, ProductSkeleton } from '../../components/product/ProductSkeleton.jsx';
import { AdvancedFilters } from '../../components/product/AdvancedFilters.jsx';
import { ProductSort } from '../../components/product/ProductSort.jsx';
import { ProductQuickViewModal } from '../../components/product/ProductQuickViewModal.jsx';
import { ProductComparisonModal } from '../../components/product/ProductComparisonModal.jsx';
import { Breadcrumb } from '../../components/common/Breadcrumb.jsx';

/**
 * Enhanced Products Page Component
 * Features:
 * - Advanced filtering (price, rating, stock)
 * - Product sorting (price, rating, popularity)
 * - Grid/List view toggle
 * - Product quick view modal
 * - Product comparison
 * - Mobile-responsive filter drawer
 * - Breadcrumb navigation
 * - Search and category filtering
 * - Pagination
 */

export const Products = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search and filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState({});

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(12); // Products per page

  // UI state
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('relevance');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Modal state
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [compareProducts, setCompareProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, advancedFilters, sortBy]);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory, advancedFilters, page, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (search && selectedCategory) {
        response = await productService.searchAndFilter(search, selectedCategory, page, limit);
      } else if (selectedCategory) {
        response = await productService.filterByCategory(selectedCategory, page, limit);
      } else if (search) {
        response = await productService.search(search, page, limit);
      } else {
        response = await productService.getAll(page, limit);
      }

      if (response.success) {
        let products = response.data.products || [];

        // Apply advanced filters
        if (Object.keys(advancedFilters).length > 0) {
          products = applyAdvancedFilters(products);
        }

        // Apply sorting
        products = sortProducts(products);

        setProducts(products);
        setTotal(response.data.total || 0);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      console.error('Product fetch error:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Apply advanced filters
  const applyAdvancedFilters = (productList) => {
    return productList.filter((product) => {
      if (advancedFilters.priceRange) {
        const [minPrice, maxPrice] = advancedFilters.priceRange;
        if (product.price < minPrice || product.price > maxPrice) {
          return false;
        }
      }
      if (advancedFilters.minRating && advancedFilters.minRating > 0) {
        if (!product.rating || product.rating < advancedFilters.minRating) {
          return false;
        }
      }
      if (advancedFilters.inStockOnly && product.stock === 0) {
        return false;
      }
      return true;
    });
  };

  // Sort products
  const sortProducts = (productList) => {
    const sorted = [...productList];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'popularity':
        sorted.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0));
        break;
      default:
        break;
    }
    return sorted;
  };

  // Debounced search handler
  const searchTimeoutRef = useRef(null);
  
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debouncing
    searchTimeoutRef.current = setTimeout(() => {
      setSearch(value);
    }, 300); // 300ms debounce delay
  }, []);

  // Category change handler
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Clear filters handler
  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setAdvancedFilters({});
    setPage(1);
  };

  // Quick view handler
  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  // Compare handler
  const handleCompare = (product) => {
    setCompareProducts((prev) => {
      const exists = prev.some((p) => p._id === product._id);
      if (exists) {
        return prev.filter((p) => p._id !== product._id);
      } else if (prev.length < 4) {
        return [...prev, product];
      } else {
        alert('You can only compare up to 4 products');
        return prev;
      }
    });
  };

  // Check if any filters are active
  const hasActiveFilters =
    search || selectedCategory || Object.keys(advancedFilters).length > 0;

  return (
    <div className="min-h-screen bg-transparent">
      {/* Scoped keyframes for staggered grid load + subtle header reveal */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .v0-fade-up { animation: fadeUp 0.5s ease-out both; }
      `}</style>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header — gradient clipped-text title to match brand pages */}
        <div className="v0-fade-up mb-8">
          <h1 className="mb-2 bg-linear-to-r from-base-content via-base-content/80 to-base-content bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
            Shop Products
          </h1>
          <p className="text-base-content/70">
            Browse our collection of {total} products
          </p>
        </div>

        {/* Search and Filter Section — elevated card with hover lift */}
        <div className="v0-fade-up mb-8 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Search Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Search Products</span>
              </label>
              <input
                type="text"
                placeholder="Search by name, brand, or category..."
                className="input input-bordered w-full transition-all duration-200 focus:scale-[1.01] focus:input-primary"
                value={search}
                onChange={handleSearchChange}
              />
              {search && (
                <p className="mt-1 text-xs text-base-content/60">
                  Searching for: <span className="font-semibold">"{search}"</span>
                </p>
              )}
            </div>

            {/* Category Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Category</span>
              </label>
              <select
                className="select select-bordered w-full transition-all duration-200 focus:select-primary"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display and Clear Button */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-base-300 pt-4">
              <div className="flex flex-wrap gap-2">
                {search && (
                  <div className="badge badge-lg badge-accent gap-2 transition-transform duration-200 hover:scale-105">
                    Search: {search}
                    <button onClick={() => setSearch('')} className="cursor-pointer">
                      ✕
                    </button>
                  </div>
                )}
                {selectedCategory && (
                  <div className="badge badge-lg badge-info gap-2 transition-transform duration-200 hover:scale-105">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('')} className="cursor-pointer">
                      ✕
                    </button>
                  </div>
                )}
                {advancedFilters.priceRange && (
                  <div className="badge badge-lg badge-warning gap-2 transition-transform duration-200 hover:scale-105">
                    Price: ${advancedFilters.priceRange[0]} - ${advancedFilters.priceRange[1]}
                    <button
                      onClick={() =>
                        setAdvancedFilters({ ...advancedFilters, priceRange: undefined })
                      }
                      className="cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleClearFilters}
                className="btn btn-sm btn-outline transition-all duration-200 hover:scale-105"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Info */}
        {!loading && products.length > 0 && (
          <div className="mb-4 text-sm text-base-content/70">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} products
          </div>
        )}

        {/* Sort and View Mode */}
        {!loading && products.length > 0 && (
          <ProductSort
            currentSort={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="btn btn-outline mb-4 w-full transition-all duration-200 hover:scale-[1.02] lg:hidden"
            >
              🎚️ Filters {compareProducts.length > 0 && `(${compareProducts.length})`}
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:block">
              <AdvancedFilters
                filters={advancedFilters}
                onFiltersChange={setAdvancedFilters}
                totalProducts={total}
                isOpen={true}
              />

              {/* Comparison Panel */}
              {compareProducts.length > 0 && (
                <div className="v0-fade-up mt-6 rounded-2xl border border-info/30 bg-info/10 p-4 shadow-sm">
                  <p className="mb-3 font-semibold">Comparing ({compareProducts.length}/4)</p>
                  <div className="mb-3 space-y-2">
                    {compareProducts.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between rounded-lg bg-base-100 p-2 transition-shadow duration-200 hover:shadow-md"
                      >
                        <p className="line-clamp-1 text-sm font-medium">{product.name}</p>
                        <button onClick={() => handleCompare(product)} className="btn btn-xs btn-ghost">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowComparison(true)}
                    className="btn btn-primary btn-sm w-full transition-all duration-200 hover:scale-[1.02]"
                  >
                    Compare ({compareProducts.length})
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Filter Drawer */}
            {filtersOpen && (
              <div className="lg:hidden">
                <AdvancedFilters
                  filters={advancedFilters}
                  onFiltersChange={setAdvancedFilters}
                  totalProducts={total}
                  onClose={() => setFiltersOpen(false)}
                  isOpen={filtersOpen}
                />
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Error State */}
            {error && (
              <div className="alert alert-error mb-6 shadow-lg">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4v2m0-10.5V5m0 16v-1m-2.5-2.5h5m-10 0h5m-8 0h5"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
                <div>
                  <button onClick={() => fetchProducts()} className="btn btn-sm btn-outline">
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div>
                <ProductGridSkeleton count={limit} />
              </div>
            )}

            {/* Products Grid — each item staggers in on load */}
            {!loading && products.length > 0 && (
              <>
                {viewMode === 'grid' ? (
                  <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product, i) => (
                      <div
                        key={product._id}
                        className="v0-fade-up"
                        style={{ animationDelay: `${Math.min(i * 60, 480)}ms` }}
                      >
                        <ProductCard
                          product={product}
                          onQuickView={handleQuickView}
                          onCompare={handleCompare}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mb-8 space-y-4">
                    {products.map((product, i) => (
                      <div
                        key={product._id}
                        className="v0-fade-up"
                        style={{ animationDelay: `${Math.min(i * 60, 480)}ms` }}
                      >
                        <ProductListCard
                          product={product}
                          onQuickView={handleQuickView}
                          onCompare={handleCompare}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && !error && (
              <div className="col-span-full">
                <div className="v0-fade-up flex flex-col items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-100/50 py-16">
                  <div className="text-center">
                    <svg
                      className="mx-auto mb-4 h-12 w-12 text-base-content/40"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4m0 0L4 7m16 0l-8 4m0 0l-8-4m0 0v10l8 4m0 0v-10m0 10l-8-4m0 0v10m16-10l-8 4m0 0v-10"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-base-content">No products found</h3>
                    <p className="mt-1 text-sm text-base-content/60">
                      {search || selectedCategory
                        ? 'Try adjusting your search or filter criteria'
                        : 'No products available at the moment'}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="btn btn-primary btn-sm mt-4 transition-all duration-200 hover:scale-105"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center justify-center gap-6 border-t border-base-300 py-8">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    className="btn btn-outline transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                    disabled={page === 1}
                    onClick={handlePrevPage}
                  >
                    ← Previous
                  </button>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          className={`btn btn-sm transition-all duration-200 hover:scale-105 ${
                            page === pageNum ? 'btn-primary' : 'btn-outline'
                          }`}
                          onClick={() => {
                            setPage(pageNum);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    className="btn btn-outline transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                    disabled={page === totalPages}
                    onClick={handleNextPage}
                  >
                    Next →
                  </button>
                </div>

                <p className="text-sm text-base-content/70">
                  Page {page} of {totalPages}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <ProductComparisonModal
        products={compareProducts}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
      />
    </div>
  );
};

export default Products;