import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignInButton, useAuth } from '@clerk/react';

const apiUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:4001/api' : '/api');

const emptyCustomer = {
  name: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  country: ''
};

const Checkout = ({ cart, isSignedIn, onOrderComplete }) => {
  const { getToken } = useAuth();
  const [customer, setCustomer] = useState(emptyCustomer);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 200 ? 0 : 15;
  const total = subtotal + shippingFee;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setOrderId('');
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/orders`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getToken()}`
        },
        method: 'POST',
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item._id,
            quantity: item.quantity
          })),
          customer
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to complete checkout.');
      }

      setStatus('Order confirmed. Your purchase has been saved to MongoDB.');
      setOrderId(data.order.id);
      onOrderComplete();
      setCustomer(emptyCustomer);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    return (
      <section className="section container">
        <div className="checkout-form-card checkout-confirmation">
          <span className="eyebrow">Order confirmed</span>
          <h2>Thanks for your purchase</h2>
          <p className="feedback">{status}</p>
          <p className="order-id">Order ID: {orderId}</p>
          <Link to="/" className="btn btn-primary">Continue shopping</Link>
        </div>
      </section>
    );
  }

  if (!cart.length) {
    return (
      <section className="section container">
        <h2>Your cart is empty</h2>
        <p>Add products to your cart before checking out.</p>
        <Link to="/" className="btn btn-primary">Back to catalog</Link>
      </section>
    );
  }

  if (!isSignedIn) {
    return (
      <section className="section container">
        <div className="checkout-form-card checkout-confirmation">
          <span className="eyebrow">Authentication required</span>
          <h2>Sign in before checkout</h2>
          <p>Sign in to place your order.</p>
          <SignInButton mode="modal">
            <button className="btn btn-primary" type="button">Sign in to continue</button>
          </SignInButton>
        </div>
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
              <div key={item._id} className="order-item">
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.quantity} × ${item.price.toFixed(2)}</p>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="order-line">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div className="order-line">
              <span>Shipping</span>
              <strong>{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</strong>
            </div>
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
              Full name
              <input
                type="text"
                value={customer.name}
                onChange={(event) => setCustomer({ ...customer, name: event.target.value })}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={customer.email}
                onChange={(event) => setCustomer({ ...customer, email: event.target.value })}
                required
              />
            </label>
            <label>
              Address
              <textarea
                rows="3"
                value={customer.address}
                onChange={(event) => setCustomer({ ...customer, address: event.target.value })}
                required
              />
            </label>
            <label>
              City
              <input
                type="text"
                value={customer.city}
                onChange={(event) => setCustomer({ ...customer, city: event.target.value })}
                required
              />
            </label>
            <label>
              Postal code
              <input
                type="text"
                value={customer.postalCode}
                onChange={(event) => setCustomer({ ...customer, postalCode: event.target.value })}
                required
              />
            </label>
            <label>
              Country
              <input
                type="text"
                value={customer.country}
                onChange={(event) => setCustomer({ ...customer, country: event.target.value })}
                required
              />
            </label>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Placing order...' : 'Place order'}
            </button>
          </form>
          {status ? <p className="feedback">{status}</p> : null}
          {orderId ? <p className="order-id">Order ID: {orderId}</p> : null}
        </div>
      </div>
    </section>
  );
};

export default Checkout;
