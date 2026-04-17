import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { clerkMiddleware, getAuth } from '@clerk/express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/db.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Message from './models/Message.js';
import { seedProductsIfEmpty } from './utils/seed.js';

dotenv.config({ path: new URL('../.env', import.meta.url) });

if (!process.env.CLERK_PUBLISHABLE_KEY && process.env.VITE_CLERK_PUBLISHABLE_KEY) {
  process.env.CLERK_PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY;
}

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
const localOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/;

app.use(clerkMiddleware());
app.use(cors({
  origin(origin, callback) {
    if (!origin || origin === allowedOrigin || localOriginPattern.test(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Origin not allowed by CORS.'));
  }
}));
app.use(express.json());

const requireApiAuth = (req, res, next) => {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated || !userId) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  req.authUserId = userId;
  return next();
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories.sort((left, right) => left.localeCompare(right)));
  } catch (error) {
    res.status(500).json({ error: 'Unable to load categories.' });
  }
});

app.get('/api/products', async (req, res) => {
  const { category, search, featured } = req.query;
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

  try {
    const products = await Product.find(filters).sort({ featured: -1, createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load products.' });
  }
});

app.get('/api/products/:identifier', async (req, res) => {
  const { identifier } = req.params;

  try {
    const byId = mongoose.Types.ObjectId.isValid(identifier)
      ? await Product.findById(identifier)
      : null;
    const product = byId || (await Product.findOne({ slug: identifier }));

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: 'Unable to load product.' });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please complete every field.' });
  }

  try {
    const savedMessage = await Message.create({ name, email, message });
    return res.status(201).json({
      message: 'Message sent successfully.',
      inquiryId: savedMessage._id
    });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to save your message right now.' });
  }
});

app.post('/api/orders', async (req, res) => {
  const { isAuthenticated, userId } = getAuth(req);
  const { items, customer } = req.body;

  if (!isAuthenticated || !userId) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Your cart is empty.' });
  }

  const requiredFields = ['name', 'email', 'address', 'city', 'postalCode', 'country'];
  const missingField = requiredFields.find((field) => !customer?.[field]);
  if (missingField) {
    return res.status(400).json({ error: `Customer ${missingField} is required.` });
  }

  try {
    const ids = items.map((item) => item.productId).filter(Boolean);
    if (ids.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      throw new Error('One or more product IDs are invalid.');
    }

    const products = await Product.find({ _id: { $in: ids } });
    const productMap = new Map(products.map((product) => [String(product._id), product]));

    const normalizedItems = items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error('One or more products no longer exist.');
      }

      const quantity = Math.max(1, Number(item.quantity) || 1);
      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image
      };
    });

    const subtotal = normalizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingFee = subtotal >= 200 ? 0 : 15;
    const total = subtotal + shippingFee;

    const order = await Order.create({
      userId,
      customer,
      items: normalizedItems,
      subtotal,
      shippingFee,
      total
    });

    return res.status(201).json({
      message: 'Order placed successfully.',
      order: {
        id: order._id,
        subtotal,
        shippingFee,
        total,
        status: order.status
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Unable to place order.' });
  }
});

app.get('/api/orders/:id', requireApiAuth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.authUserId
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error: 'Unable to load order.' });
  }
});

app.get('/api/me', requireApiAuth, async (req, res) => {
  return res.json({ userId: req.authUserId });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(new URL('../client/dist', import.meta.url).pathname));
  app.get('*', (req, res) => {
    res.sendFile(new URL('../client/dist/index.html', import.meta.url).pathname);
  });
}

const startServer = async () => {
  try {
    await connectDatabase();
    await seedProductsIfEmpty();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

startServer();
