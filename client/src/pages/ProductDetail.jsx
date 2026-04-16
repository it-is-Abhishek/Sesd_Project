import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL || '/api';

const ProductDetail = ({ products, addToCart }) => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initial = products.find((item) => item.slug === slug || item._id === slug);
    if (initial) {
      setProduct(initial);
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        const response = await fetch(`${apiUrl}/products/${slug}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Unable to load product.');
        }
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug, products]);

  if (loading) {
    return <div className="container section"><p>Loading product...</p></div>;
  }

  if (!product?._id) {
    return (
      <div className="container section">
        <h2>Product not found</h2>
        <p>The item you are looking for does not exist.</p>
        <Link to="/" className="btn btn-secondary">Back to shop</Link>
      </div>
    );
  }

  return (
    <section className="section container product-detail">
      <div className="detail-grid">
        <img className="detail-image" src={product.image} alt={product.name} />
        <div className="detail-copy">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="detail-facts">
            <span>Brand: {product.brand}</span>
            <span>Rating: {product.rating.toFixed(1)} / 5</span>
            <span>{product.stock} in stock</span>
          </div>
          <div className="price-row">
            <div className="price-stack">
              <strong>${product.price.toFixed(2)}</strong>
              {product.compareAtPrice ? (
                <small>${product.compareAtPrice.toFixed(2)}</small>
              ) : null}
            </div>
            <button className="btn btn-primary" onClick={() => addToCart(product)}>
              Add to cart
            </button>
          </div>
          <div className="tag-row">
            {product.tags.map((tag) => (
              <span key={tag} className="pill muted-pill">{tag}</span>
            ))}
          </div>
          <Link to="/checkout" className="btn btn-secondary">Go to checkout</Link>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
