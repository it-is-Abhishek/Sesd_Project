import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/db.js';
import { seedProductsIfEmpty } from './utils/seed.js';
import ProductRepository from './repositories/ProductRepository.js';
import OrderRepository from './repositories/OrderRepository.js';
import MessageRepository from './repositories/MessageRepository.js';
import UserRepository from './repositories/UserRepository.js';
import CatalogService from './services/CatalogService.js';
import OrderService from './services/OrderService.js';
import InquiryService from './services/InquiryService.js';
import AuthService from './services/AuthService.js';
import CatalogController from './controllers/CatalogController.js';
import OrderController from './controllers/OrderController.js';
import InquiryController from './controllers/InquiryController.js';

dotenv.config({ path: new URL('../.env', import.meta.url) });

if (!process.env.CLERK_PUBLISHABLE_KEY && process.env.VITE_CLERK_PUBLISHABLE_KEY) {
  process.env.CLERK_PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY;
}

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
const localOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/;

const productRepository = new ProductRepository();
const orderRepository = new OrderRepository();
const messageRepository = new MessageRepository();
const userRepository = new UserRepository();

const catalogService = new CatalogService(productRepository);
const orderService = new OrderService(orderRepository, productRepository);
const inquiryService = new InquiryService(messageRepository);
const authService = new AuthService(userRepository);

const catalogController = new CatalogController(catalogService);
const orderController = new OrderController(orderService, authService);
const inquiryController = new InquiryController(inquiryService);

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
app.locals.databaseReady = false;

app.get('/api/health', catalogController.getHealth);
app.get('/api/categories', catalogController.getCategories);
app.get('/api/products', catalogController.getProducts);
app.get('/api/products/:identifier', catalogController.getProductByIdentifier);
app.post('/api/contact', inquiryController.createInquiry);
app.post('/api/orders', orderController.createOrder);
app.get('/api/orders/:id', orderController.getOrderById);
app.get('/api/me', orderController.getCurrentUser);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(new URL('../client/dist', import.meta.url).pathname));
  app.get('*', (req, res) => {
    res.sendFile(new URL('../client/dist/index.html', import.meta.url).pathname);
  });
}

const bootServer = async () => {
  try {
    await connectDatabase();
    await seedProductsIfEmpty();
    app.locals.databaseReady = true;
  } catch (error) {
    console.error(`Database unavailable, starting API in fallback mode: ${error.message}`);
    app.locals.databaseReady = false;
  }

  app.listen(PORT, () => {
    const mode = app.locals.databaseReady ? 'database connected' : 'fallback catalog mode';
    console.log(`Server running on http://localhost:${PORT} (${mode})`);
  });
};

bootServer();
