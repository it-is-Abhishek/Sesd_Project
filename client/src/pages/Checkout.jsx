import { useState } from 'react';

const apiUrl = 'http://localhost:4000/api';

const Checkout = ({ cart, onOrderComplete }) => {
  const [shipping, setShipping] = useState({ name: '', email: '', address: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setLoading(true);

    const response = await fetch(`${apiUrl}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart, shipping })
    });

    const data = await response.json();
    setLoading(false);

    if (response.ok) {
      setStatus('Order confirmed! Thank you for your purchase.');
      onOrderComplete();
      setShipping({ name: '', email: '', address: '' });
    } else {
      setStatus(data.error || 'Unable to complete checkout.');
    }
  };

  if (!cart.length) {
    return (
      <section className="section container">
        <h2>Your cart is empty</h2>
        <p>Add products to your cart before checking out.</p>
      </section>
    );
  }

  return (
    <section className="section container checkout-page">
      <div className="checkout-grid">
        <div className="checkout-summary">
          <span className="eyebrow">Order summary</span>
          <h2>Your items</h2>
          <div className="order-list">
            {cart.map((item) => (
              <div key={item.id} className="order-item">
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.quantity} × ${item.price}</p>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="order-total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div className="checkout-form-card">
          <span className="eyebrow">Shipping details</span>
          <h2>Complete your purchase</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                type="text"
                value={shipping.name}
                onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={shipping.email}
                onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                required
              />
            </label>
            <label>
              Address
              <textarea
                rows="4"
                value={shipping.address}
                onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                required
              />
            </label>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Placing order...' : 'Place order'}
            </button>
          </form>
          {status && <p className="feedback">{status}</p>}
        </div>
      </div>
    </section>
  );
};

export default Checkout;
