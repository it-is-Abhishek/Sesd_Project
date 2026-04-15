import { Link } from 'react-router-dom';

const Home = ({ products, loading, addToCart, form, setForm, message, handleSubmit }) => {
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-copy">
          <span className="eyebrow">New arrivals</span>
          <h1>Shop modern essentials with powerful performance.</h1>
          <p>Fast browsing, secure checkout, and curated collections for your daily style.</p>
          <div className="hero-actions">
            <a href="#products" className="btn btn-primary">Shop now</a>
            <a href="#categories" className="btn btn-secondary">Browse categories</a>
          </div>
        </div>
        <div className="hero-feature">
          <div className="feature-card">
            <h2>Featured product</h2>
            <p>Premium wireless speaker with rich audio and portable design.</p>
          </div>
        </div>
      </section>

      <section className="section container" id="products">
        <div className="section-header">
          <span className="eyebrow">Products</span>
          <h2>Featured picks from our catalog</h2>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-image" />
                <div className="product-body">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-meta">
                    <span>${product.price}</span>
                    <div className="product-actions">
                      <button className="btn btn-sm" onClick={() => addToCart(product)}>
                        Add to cart
                      </button>
                      <Link to={`/product/${product.id}`} className="btn btn-secondary btn-sm">
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section container" id="categories">
        <div className="section-header">
          <span className="eyebrow">Categories</span>
          <h2>Shop popular collections</h2>
        </div>
        <div className="category-grid">
          {['Fashion', 'Electronics', 'Home', 'Accessories'].map((title) => (
            <div key={title} className="category-card">
              <h3>{title}</h3>
              <p>Explore curated items for {title.toLowerCase()} lovers.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="about-panel">
          <div>
            <span className="eyebrow">About us</span>
            <h2>Designed for effortless shopping.</h2>
            <p>SesdShop blends premium product selection, fast service, and secure checkout in one responsive experience.</p>
          </div>
          <div className="about-stats">
            <div>
              <strong>12k+</strong>
              <span>Customers served</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Support available</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="section-header">
          <span className="eyebrow">Contact</span>
          <h2>Send us a message</h2>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label>
            Message
            <textarea
              rows="5"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </label>
          <button className="btn btn-primary" type="submit">Send message</button>
          {message && <p className="feedback">{message}</p>}
        </form>
      </section>
    </>
  );
};

export default Home;
