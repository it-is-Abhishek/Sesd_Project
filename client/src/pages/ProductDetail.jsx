import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const apiUrl = 'http://localhost:4000/api';

const ProductDetail = ({ products, addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initial = products.find((item) => item.id === Number(id));
    if (initial) {
      setProduct(initial);
      setLoading(false);
      return;
    }

    fetch(`${apiUrl}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, products]);

  if (loading) {
    return <div className="container"><p>Loading product...</p></div>;
  }

  if (!product?.id) {
    return (
      <div className="container">
        <h2>Product not found</h2>
        <p>The item you are looking for does not exist.</p>
        <Link to="/" className="btn btn-secondary">Back to shop</Link>
      </div>
    );
  }

  return (
    <section className="section container product-detail">
      <div className="detail-grid">
        <div className="detail-image" />
        <div className="detail-copy">
          <span className="eyebrow">Product details</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="price-row">
            <strong>${product.price}</strong>
            <button className="btn btn-primary" onClick={() => addToCart(product)}>
              Add to cart
            </button>
          </div>
          <Link to="/checkout" className="btn btn-secondary">Go to checkout</Link>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
