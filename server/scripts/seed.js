import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import { reseedProducts } from '../utils/seed.js';

try {
  await connectDatabase();
  await reseedProducts();
  await mongoose.connection.close();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
