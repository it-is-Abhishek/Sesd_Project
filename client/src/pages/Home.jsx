import { Link } from 'react-router-dom';

const stats = [
  { value: '24h', label: 'Fast dispatch' },
  { value: '4.8/5', label: 'Top-rated picks' },
  { value: 'Free', label: 'Shipping over $200' }
];

const Home = ({
  products,
  categories,
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
  loading,
  error,
  addToCart
}) => {
  const featuredProduct = products[0];

  return (
    <>
      <section className="hero container" id="home">
        <div className="hero-copy">
          <span className="eyebrow">MongoDB commerce</span>
          <h1>Clean essentials for modern living.</h1>
          <p>Shop curated gear, home pieces, and everyday upgrades.</p>
          <div className="hero-actions">
            <a href="#products" className="btn btn-primary">Shop now</a>
            <a href="#categories" className="btn btn-secondary">Browse categories</a>
          </div>
        </div>

        <div className="hero-feature">
          <div className="feature-card feature-highlight">
            <p className="feature-label">Featured drop</p>
            <h2>{featuredProduct?.name || 'Loading catalog...'}</h2>
            <p>{featuredProduct?.shortDescription || 'Latest arrivals land here.'}</p>
            {featuredProduct ? (
              <Link to={`/product/${featuredProduct.slug}`} className="btn btn-primary">
                View product
              </Link>
            ) : null}
          </div>
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section container" id="products">
        <div className="section-header">
          <span className="eyebrow">Catalog</span>
          <h2>Shop the latest picks</h2>
        </div>

        <div className="catalog-toolbar">
          <input
            className="search-input"
            type="search"
            placeholder="Search products, descriptions, or tags"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <div className="category-pills">
            {categories.map((item) => (
              <button
                key={item}
                className={`pill ${item === activeCategory ? 'pill-active' : ''}`}
                onClick={() => onCategoryChange(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {loading ? <p>Loading products...</p> : null}
        {error ? <p className="feedback feedback-error">{error}</p> : null}
        {!loading && !error && products.length === 0 ? (
          <p>No products matched your search.</p>
        ) : null}

        {!loading && !error ? (
          <div className="product-grid">
            {products.map((product) => (
              <article key={product._id} className="product-card">
                <img className="product-image" src={product.image} alt={product.name} />
                <div className="product-body">
                  <div className="product-topline">
                    <span>{product.category}</span>
                    <span>{product.rating.toFixed(1)} / 5</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.shortDescription}</p>
                  <div className="product-meta">
                    <div>
                      <strong>${product.price.toFixed(2)}</strong>
                      {product.compareAtPrice ? (
                        <small>${product.compareAtPrice.toFixed(2)}</small>
                      ) : null}
                    </div>
                    <div className="product-actions">
                      <button className="btn btn-sm" onClick={() => addToCart(product)}>
                        Add to cart
                      </button>
                      <Link to={`/product/${product.slug}`} className="btn btn-secondary btn-sm">
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section className="section container" id="categories">
        <div className="section-header">
          <span className="eyebrow">Collections</span>
          <h2>Browse by category</h2>
        </div>
        <div className="category-grid">
          {categories
            .filter((item) => item !== 'All')
            .map((title) => (
              <button
                key={title}
                className="category-card"
                onClick={() => onCategoryChange(title)}
              >
                <h3>{title}</h3>
                <p>Explore {title.toLowerCase()}.</p>
              </button>
            ))}
        </div>
      </section>

      <section className="section about-section container" id="about">
        <div className="about-panel">
          <div>
            <span className="eyebrow">Why shop here</span>
            <h2>Simple shopping, fast checkout.</h2>
            <p>Focused products, clean browsing, and quick ordering.</p>
          </div>
          <div className="about-stats">
            <div>
              <strong>Products</strong>
              <span>Easy to browse and compare.</span>
            </div>
            <div>
              <strong>Orders</strong>
              <span>Fast checkout with saved orders.</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
