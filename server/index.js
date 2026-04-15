import express from 'express';
import cors from 'cors';
import products from './data/products.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  res.json(product);
});

app.post('/api/checkout', (req, res) => {
  const { cart, shipping } = req.body;

  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Your cart is empty.' });
  }

  if (!shipping?.name || !shipping?.email || !shipping?.address) {
    return res.status(400).json({ error: 'Shipping information is required.' });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return res.json({
    status: 'success',
    order: {
      total,
      items: cart.length,
      shipping,
      message: 'Order placed successfully.'
    }
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(new URL('../client/dist', import.meta.url).pathname));
  app.get('*', (req, res) => {
    res.sendFile(new URL('../client/dist/index.html', import.meta.url).pathname);
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
