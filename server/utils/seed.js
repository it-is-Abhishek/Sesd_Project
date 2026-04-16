import Product from '../models/Product.js';
import seedProducts from '../data/seedProducts.js';

export const seedProductsIfEmpty = async () => {
  const count = await Product.countDocuments();
  if (count > 0) {
    return;
  }

  await Product.insertMany(seedProducts);
  console.log('Seeded initial product catalog.');
};

export const reseedProducts = async () => {
  await Product.deleteMany({});
  await Product.insertMany(seedProducts);
  console.log('Replaced product catalog with seed data.');
};
