import { useCallback } from 'react';

/**
 * Product Sort Component
 * Provides sorting options for product listings
 */
export const ProductSort = ({ currentSort, onSortChange, viewMode, onViewModeChange }) => {
  const sortOptions = [
    { value: 'relevance', label: 'Relevance', icon: '🔍' },
    { value: 'price-low', label: 'Price: Low to High', icon: '📉' },
    { value: 'price-high', label: 'Price: High to Low', icon: '📈' },
    { value: 'rating', label: 'Highest Rated', icon: '⭐' },
    { value: 'newest', label: 'Newest First', icon: '🆕' },
    { value: 'popularity', label: 'Most Popular', icon: '🔥' }
  ];

  const handleSortChange = useCallback(
    (value) => {
      onSortChange?.(value);
    },
    [onSortChange]
  );

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-base-100 p-4 rounded-lg shadow-sm mb-6">
      {/* Left - Sort Dropdown */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <svg
          className="h-5 w-5 text-base-content/70"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zm0 4a1 1 0 000 2h5a1 1 0 000-2H3zm0 4a1 1 0 100 2h4a1 1 0 100-2H3zm12-4a1 1 0 102 0v-1a3 3 0 00-3-3H9a1 1 0 000 2h3v1zm-12 4a1 1 0 100 2h4a1 1 0 100-2H3z"
            clipRule="evenodd"
          />
        </svg>
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="select select-bordered select-sm flex-1 sm:flex-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Divider */}
      <div className="hidden h-8 w-px bg-base-300 sm:block" />

      {/* Right - View Mode Toggle */}
      <div className="flex items-center gap-2">
        <span className="hidden text-sm font-semibold text-base-content/80 sm:inline">
          View:
        </span>
        <div className="btn-group">
          <button
            onClick={() => onViewModeChange?.('grid')}
            className={`btn btn-sm ${
              viewMode === 'grid' ? 'btn-active' : 'btn-outline'
            }`}
            title="Grid view"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
            </svg>
            Grid
          </button>
          <button
            onClick={() => onViewModeChange?.('list')}
            className={`btn btn-sm ${
              viewMode === 'list' ? 'btn-active' : 'btn-outline'
            }`}
            title="List view"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            List
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSort;
