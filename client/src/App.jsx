import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import CartDrawer from './components/CartDrawer';

const apiUrl = 'http://localhost:4000/api';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const saved = localStorage.getItem('sesd-cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sesd-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    fetch(`${apiUrl}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    const response = await fetch(`${apiUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await response.json();
    if (response.ok) {
      setMessage('Message sent. We will contact you shortly.');
      setForm({ name: '', email: '', message: '' });
    } else {
      setMessage(data.error || 'Please complete every field.');
    }
  };

  return (
    <Router>
      <div className="app-shell">
        <header className="site-header">
          <div className="brand">Sesd<span>Shop</span></div>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/">Products</Link>
            <Link to="/checkout">Checkout</Link>
          </nav>
          <button className="cart-button" onClick={() => setCartOpen(true)}>
            Cart ({cartCount})
          </button>
        </header>

        <CartDrawer cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} onRemove={removeFromCart} />

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  products={products}
                  loading={loading}
                  addToCart={addToCart}
                  form={form}
                  setForm={setForm}
                  message={message}
                  handleSubmit={handleSubmit}
                />
              }
            />
            <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} onOrderComplete={() => { clearCart(); setCartOpen(false); }} />} />
          </Routes>
        </main>

        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <div className="brand">Sesd<span>Shop</span></div>
              <p>Your responsive React + Node e-commerce starter.</p>
            </div>
            <div>
              <h4>Contact</h4>
              <p>hi@sesdshop.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
