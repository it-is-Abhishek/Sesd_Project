import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import CartDrawer from './components/CartDrawer';

const apiUrl = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [catalogError, setCatalogError] = useState('');
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
    const loadCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/categories`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Unable to load categories.');
        }
        setCategories(['All', ...data]);
      } catch (error) {
        console.error(error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      setLoading(true);
      setCatalogError('');

      try {
        const query = new URLSearchParams();
        if (category !== 'All') {
          query.set('category', category);
        }
        if (search.trim()) {
          query.set('search', search.trim());
        }

        const response = await fetch(`${apiUrl}/products?${query.toString()}`, {
          signal: controller.signal
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load products.');
        }

        setProducts(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setCatalogError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    return () => controller.abort();
  }, [category, search]);

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item._id === product._id);
      if (existing) {
        return current.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((current) => current.filter((item) => item._id !== id));
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((current) =>
      current.map((item) => (item._id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Please complete every field.');
      }

      setMessage('Message sent. We will contact you shortly.');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <Router>
      <div className="app-shell">
        <header className="site-header container">
          <Link to="/" className="brand">Sesd<span>Shop</span></Link>
          <nav className="nav-links">
            <a href="/#products">Products</a>
            <a href="/#categories">Categories</a>
            <Link to="/checkout">Checkout</Link>
          </nav>
          <button className="cart-button" onClick={() => setCartOpen(true)}>
            Cart ({cartCount})
          </button>
        </header>

        <CartDrawer
          cart={cart}
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onQuantityChange={updateCartQuantity}
        />

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  products={products}
                  categories={categories}
                  activeCategory={category}
                  onCategoryChange={setCategory}
                  search={search}
                  onSearchChange={setSearch}
                  loading={loading}
                  error={catalogError}
                  addToCart={addToCart}
                  form={form}
                  setForm={setForm}
                  message={message}
                  handleSubmit={handleSubmit}
                />
              }
            />
            <Route
              path="/product/:slug"
              element={<ProductDetail products={products} addToCart={addToCart} />}
            />
            <Route
              path="/checkout"
              element={
                <Checkout
                  cart={cart}
                  onOrderComplete={() => {
                    clearCart();
                    setCartOpen(false);
                  }}
                />
              }
            />
          </Routes>
        </main>

        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <div className="brand">Sesd<span>Shop</span></div>
              <p>MongoDB-backed storefront with searchable catalog and persisted orders.</p>
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
