import mongoose from 'mongoose';
import Product from '../models/Product.js';

class ProductRepository {
  async getDistinctCategories() {
    return Product.distinct('category');
  }

  async findProducts(filters) {
    return Product.find(filters).sort({ featured: -1, createdAt: -1 });
  }

  async findByIdentifier(identifier) {
    const byId = mongoose.Types.ObjectId.isValid(identifier)
      ? await Product.findById(identifier)
      : null;

    return byId || Product.findOne({ slug: identifier });
  }

  async findByIds(ids) {
    return Product.find({ _id: { $in: ids } });
  }
}

export default ProductRepository;
