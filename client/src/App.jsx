import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { ClerkLoaded, ClerkLoading, SignIn, SignUp, UserButton, useAuth } from '@clerk/react';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import CartDrawer from './components/CartDrawer';

const apiUrl = import.meta.env.VITE_API_URL || '/api';

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useAuth();
  const [authMode, setAuthMode] = useState('sign-in');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');

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

  const goToSection = async (sectionId) => {
    if (location.pathname !== '/') {
      await navigate('/');
      requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header-inner container">
          <Link to="/" className="brand">North<span>Lane</span></Link>
          {isSignedIn ? (
            <nav className="nav-links">
              <button className="nav-link-button" type="button" onClick={() => goToSection('products')}>
                Products
              </button>
              <button className="nav-link-button" type="button" onClick={() => goToSection('categories')}>
                Categories
              </button>
              <Link to="/checkout">Checkout</Link>
            </nav>
          ) : (
            <div className="nav-spacer" />
          )}
          <div className="header-actions">
            <ClerkLoading>
              <div className="auth-skeleton" aria-hidden="true" />
            </ClerkLoading>
            <ClerkLoaded>
              {isSignedIn ? (
                <div className="auth-controls">
                  <UserButton afterSignOutUrl="/" />
                  <button className="cart-button" onClick={() => setCartOpen(true)}>
                    Cart ({cartCount})
                  </button>
                </div>
              ) : null}
            </ClerkLoaded>
          </div>
        </div>
      </header>

      {isSignedIn ? (
        <CartDrawer
          cart={cart}
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onQuantityChange={updateCartQuantity}
        />
      ) : null}

      <main>
        <ClerkLoading>
          <section className="section container page-loader">
            <div className="page-loader-card">
              <span className="eyebrow">Loading</span>
              <h2>Preparing your store...</h2>
            </div>
          </section>
        </ClerkLoading>
        <ClerkLoaded>
          {isSignedIn ? (
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
                    isSignedIn={Boolean(isSignedIn)}
                    onOrderComplete={() => {
                      clearCart();
                      setCartOpen(false);
                    }}
                  />
                }
              />
            </Routes>
          ) : (
            <section className="section container auth-gate">
              <div className="auth-gate-copy">
                <span className="eyebrow">Members access</span>
                <h1>Sign in to enter NorthLane.</h1>
                <p>The storefront appears right after authentication.</p>
                <div className="auth-toggle-row">
                  <button
                    className={`pill ${authMode === 'sign-in' ? 'pill-active' : ''}`}
                    type="button"
                    onClick={() => setAuthMode('sign-in')}
                  >
                    Sign in
                  </button>
                  <button
                    className={`pill ${authMode === 'sign-up' ? 'pill-active' : ''}`}
                    type="button"
                    onClick={() => setAuthMode('sign-up')}
                  >
                    Sign up
                  </button>
                </div>
              </div>
              <div className="auth-gate-card">
                {authMode === 'sign-in' ? (
                  <SignIn routing="hash" signUpUrl="#sign-up" />
                ) : (
                  <SignUp routing="hash" signInUrl="#sign-in" />
                )}
              </div>
            </section>
          )}
        </ClerkLoaded>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
