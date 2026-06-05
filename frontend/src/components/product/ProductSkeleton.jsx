/**
 * ProductSkeleton Component
 * Displays loading skeleton for product cards
 * Used during data fetching to show loading state
 */

export const ProductSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow-md animate-pulse">
      {/* Image placeholder */}
      <div className="px-4 pt-4 h-48 bg-base-300 rounded-lg"></div>

      {/* Content skeleton */}
      <div className="card-body space-y-3">
        {/* Product name skeleton */}
        <div className="h-6 bg-base-300 rounded w-3/4"></div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-base-300 rounded w-full"></div>
          <div className="h-4 bg-base-300 rounded w-5/6"></div>
        </div>

        {/* Price and stock skeleton */}
        <div className="flex justify-between items-center mt-2">
          <div className="h-6 bg-base-300 rounded w-1/4"></div>
          <div className="h-4 bg-base-300 rounded w-1/4"></div>
        </div>

        {/* Buttons skeleton */}
        <div className="card-actions mt-4 gap-2">
          <div className="h-10 bg-base-300 rounded flex-1"></div>
          <div className="h-10 bg-base-300 rounded flex-1"></div>
        </div>
      </div>
    </div>
  );
};

/**
 * ProductGridSkeleton Component
 * Displays multiple skeleton loaders in a grid
 */
export const ProductGridSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};
