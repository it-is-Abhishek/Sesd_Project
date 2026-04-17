class CatalogService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async getCategories() {
    const categories = await this.productRepository.getDistinctCategories();
    return categories.sort((left, right) => left.localeCompare(right));
  }

  async getProducts(query) {
    const filters = this.buildFilters(query);
    return this.productRepository.findProducts(filters);
  }

  async getProductByIdentifier(identifier) {
    return this.productRepository.findByIdentifier(identifier);
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
}

export default CatalogService;
