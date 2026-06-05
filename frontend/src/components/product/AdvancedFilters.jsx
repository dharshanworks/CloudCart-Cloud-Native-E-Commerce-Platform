import { useState, useEffect } from 'react';

/**
 * Advanced Filters Component
 * Provides price range, rating, stock filtering
 * Mobile-responsive with drawer UI on small screens
 */
export const AdvancedFilters = ({
  filters,
  onFiltersChange,
  totalProducts,
  onClose,
  isOpen = true
}) => {
  const [localFilters, setLocalFilters] = useState({
    priceRange: filters?.priceRange || [0, 10000],
    minRating: filters?.minRating || 0,
    inStockOnly: filters?.inStockOnly || false,
    ...filters
  });

  // Handle price range change
  const handlePriceChange = (e, type) => {
    const value = parseFloat(e.target.value);
    const newRange = [...localFilters.priceRange];
    if (type === 'min') {
      newRange[0] = Math.min(value, newRange[1]);
    } else {
      newRange[1] = Math.max(value, newRange[0]);
    }
    setLocalFilters({ ...localFilters, priceRange: newRange });
  };

  // Handle rating filter
  const handleRatingChange = (rating) => {
    setLocalFilters({ ...localFilters, minRating: rating });
  };

  // Handle stock filter
  const handleStockChange = (e) => {
    setLocalFilters({
      ...localFilters,
      inStockOnly: e.target.checked
    });
  };

  // Apply filters
  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose?.();
  };

  // Reset filters
  const handleResetFilters = () => {
    const defaultFilters = {
      priceRange: [0, 10000],
      minRating: 0,
      inStockOnly: false
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  // Check if filters are active
  const isFiltersActive =
    localFilters.priceRange[0] > 0 ||
    localFilters.priceRange[1] < 10000 ||
    localFilters.minRating > 0 ||
    localFilters.inStockOnly;

  const filterContent = (
    <div className="space-y-6">
      {/* Price Range Filter */}
      <div>
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M8.5 5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM2 8a1 1 0 100 2v5a2 2 0 002 2h12a2 2 0 002-2V9a1 1 0 100-2H2zm11.354 5a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 1.414l4 4z" />
          </svg>
          Price Range
        </h3>
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <div className="form-control flex-1">
              <label className="label py-1">
                <span className="label-text text-xs">Min</span>
              </label>
              <input
                type="number"
                min="0"
                max={localFilters.priceRange[1]}
                value={localFilters.priceRange[0]}
                onChange={(e) => handlePriceChange(e, 'min')}
                className="input input-bordered input-sm w-full"
                placeholder="Min price"
              />
            </div>
            <div className="text-center text-sm font-semibold mt-5">—</div>
            <div className="form-control flex-1">
              <label className="label py-1">
                <span className="label-text text-xs">Max</span>
              </label>
              <input
                type="number"
                min={localFilters.priceRange[0]}
                max="10000"
                value={localFilters.priceRange[1]}
                onChange={(e) => handlePriceChange(e, 'max')}
                className="input input-bordered input-sm w-full"
                placeholder="Max price"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="range"
              min="0"
              max="10000"
              value={localFilters.priceRange[0]}
              onChange={(e) => handlePriceChange(e, 'min')}
              className="range range-sm flex-1"
            />
            <input
              type="range"
              min="0"
              max="10000"
              value={localFilters.priceRange[1]}
              onChange={(e) => handlePriceChange(e, 'max')}
              className="range range-sm flex-1"
            />
          </div>
          <div className="text-xs text-base-content/60">
            ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
          </div>
        </div>
      </div>

      <div className="divider my-4" />

      {/* Rating Filter */}
      <div>
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Minimum Rating
        </h3>
        <div className="space-y-2">
          {[0, 3, 4, 5].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-3 cursor-pointer hover:bg-base-200 p-2 rounded transition"
            >
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={localFilters.minRating === rating}
                onChange={() => handleRatingChange(rating)}
                className="radio radio-sm"
              />
              <span className="flex-1 text-sm">
                {rating === 0 ? 'All Ratings' : `${rating}★ & Up`}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="divider my-4" />

      {/* Stock Filter */}
      <div>
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 5a3 3 0 015-3h6a3 3 0 015 3v12a3 3 0 01-3 3H8a3 3 0 01-3-3V5zm12 0a1 1 0 00-1-1H8a1 1 0 00-1 1v12a1 1 0 001 1h6a1 1 0 001-1V5z"
              clipRule="evenodd"
            />
          </svg>
          Availability
        </h3>
        <label className="flex items-center gap-3 cursor-pointer hover:bg-base-200 p-2 rounded transition">
          <input
            type="checkbox"
            checked={localFilters.inStockOnly}
            onChange={handleStockChange}
            className="checkbox checkbox-sm"
          />
          <span className="text-sm">In Stock Only</span>
        </label>
      </div>

      {/* Active Filters Display */}
      {isFiltersActive && (
        <>
          <div className="divider my-4" />
          <div className="rounded-lg bg-base-200 p-3">
            <p className="mb-2 text-xs text-base-content/70">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              {localFilters.priceRange[0] > 0 && (
                <div className="badge badge-sm">
                  Min: ${localFilters.priceRange[0]}
                </div>
              )}
              {localFilters.priceRange[1] < 10000 && (
                <div className="badge badge-sm">
                  Max: ${localFilters.priceRange[1]}
                </div>
              )}
              {localFilters.minRating > 0 && (
                <div className="badge badge-sm">
                  Rating: {localFilters.minRating}★+
                </div>
              )}
              {localFilters.inStockOnly && (
                <div className="badge badge-sm">In Stock</div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <button
          onClick={handleApplyFilters}
          className="btn btn-primary btn-sm flex-1"
        >
          Apply Filters
        </button>
        {isFiltersActive && (
          <button
            onClick={handleResetFilters}
            className="btn btn-outline btn-sm flex-1"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );

  // Mobile drawer layout
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return (
      <div
        className={`fixed inset-0 z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`fixed inset-y-0 left-0 bg-base-100 shadow-xl transform transition-transform w-80 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="sticky top-0 bg-base-100 border-b p-4 flex justify-between items-center">
            <h2 className="text-lg font-bold">Filters</h2>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
            {filterContent}
          </div>
        </div>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
        )}
      </div>
    );
  }

  // Desktop sidebar layout
  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-md h-fit sticky top-4">
      {filterContent}
    </div>
  );
};

export default AdvancedFilters;
