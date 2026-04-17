import seedProducts from '../data/seedProducts.js';

const fallbackProducts = seedProducts.map((product, index) => ({
  _id: String(index + 1).padStart(24, '0'),
  ...product
}));

class CatalogService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async getCategories() {
    try {
      const categories = await this.productRepository.getDistinctCategories();
      return categories.sort((left, right) => left.localeCompare(right));
    } catch (error) {
      return this.getFallbackCategories();
    }
  }

  async getProducts(query) {
    try {
      const filters = this.buildFilters(query);
      return await this.productRepository.findProducts(filters);
    } catch (error) {
      return this.getFallbackProducts(query);
    }
  }

  async getProductByIdentifier(identifier) {
    try {
      return await this.productRepository.findByIdentifier(identifier);
    } catch (error) {
      return this.getFallbackProductByIdentifier(identifier);
    }
  }

  buildFilters({ category, search, featured }) {
    const filters = {};

    if (category && category !== 'All') {
      filters.category = category;
    }

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }

    if (featured === 'true') {
      filters.featured = true;
    }

    return filters;
  }

  filterFallbackProducts({ category, search, featured }) {
    return fallbackProducts.filter((product) => {
      const categoryMatch = !category || category === 'All' || product.category === category;
      const featuredMatch = featured !== 'true' || product.featured;
      const searchTerm = search?.trim().toLowerCase();
      const searchMatch =
        !searchTerm ||
        [product.name, product.description, ...(product.tags || [])]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm);

      return categoryMatch && featuredMatch && searchMatch;
    });
  }

  getFallbackCategories() {
    return [...new Set(fallbackProducts.map((product) => product.category))]
      .sort((left, right) => left.localeCompare(right));
  }

  getFallbackProducts(query = {}) {
    return this.filterFallbackProducts(query);
  }

  getFallbackProductByIdentifier(identifier) {
    return fallbackProducts.find(
      (product) => product.slug === identifier || product._id === identifier
    ) || null;
  }
}

export default CatalogService;
