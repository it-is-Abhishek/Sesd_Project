import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDatabase } from '../config/db.js';
import { reseedProducts } from '../utils/seed.js';

dotenv.config({ path: new URL('../../.env', import.meta.url) });

if (!process.env.CLERK_PUBLISHABLE_KEY && process.env.VITE_CLERK_PUBLISHABLE_KEY) {
  process.env.CLERK_PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY;
}

try {
  await connectDatabase();
  await reseedProducts();
  await mongoose.connection.close();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
