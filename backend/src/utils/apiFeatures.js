/**
 * API Features
 * Handles search, filtering, and pagination for MongoDB queries
 */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Search functionality
   * Searches across name, description, and brand fields
   */
  search() {
    if (this.queryString.search) {
      const search = this.queryString.search.trim();
      this.query = this.query.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } }
        ]
      });
    }
    return this;
  }

  /**
   * Filter functionality
   * Filters by category, price range, and active status
   */
  filter() {
    const queryStringCopy = { ...this.queryString };

    // Remove pagination and search params
    const removeFields = ['search', 'sort', 'limit', 'page'];
    removeFields.forEach((field) => delete queryStringCopy[field]);

    // Convert object to string and apply operators
    let filterStr = JSON.stringify(queryStringCopy);
    filterStr = filterStr.replace(/\b(gte|lte|gt|lt|eq)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(filterStr));
    return this;
  }

  /**
   * Sort functionality
   * Sort by single or multiple fields
   * Example: sort=-price,name
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Default sort by newest first
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  /**
   * Pagination functionality
   * Example: page=2&limit=10
   */
  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 10;

    // Validate page and limit
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 per page

    const skip = (validPage - 1) * validLimit;
    this.query = this.query.skip(skip).limit(validLimit);

    return this;
  }

  /**
   * Get total count for pagination metadata
   * Used in controllers to return total count
   * This method clones the current query to get an accurate count
   * without pagination applied
   */
  async getTotal() {
    // Clone the current query to get accurate count
    // This preserves all filters, search, and conditions already applied
    const countQuery = this.query.clone();
    
    // Remove pagination-related operators from the cloned query
    // The cloned query already has all filters, we just need to count
    return await countQuery.countDocuments();
  }
}

export default APIFeatures;
