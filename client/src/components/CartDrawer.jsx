import { Link } from 'react-router-dom';

const CartDrawer = ({ cart, open, onClose, onRemove, onQuantityChange }) => {
  if (!open) {
    return null;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-drawer-backdrop" onClick={onClose}>
      <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="cart-drawer-header">
          <h3>Your cart</h3>
          <button className="icon-button" onClick={onClose} aria-label="Close cart">x</button>
        </div>

        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty. Add items to continue.</p>
        ) : (
          <div className="cart-drawer-body">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-copy">
                  <strong>{item.name}</strong>
                  <p>${item.price.toFixed(2)}</p>
                  <div className="quantity-row">
                    <button className="qty-button" onClick={() => onQuantityChange(item._id, item.quantity - 1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button className="qty-button" onClick={() => onQuantityChange(item._id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                </div>
                <button className="btn btn-sm remove-item" onClick={() => onRemove(item._id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="cart-drawer-footer">
          <div className="cart-total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
          <Link to="/checkout" className="btn btn-primary drawer-checkout" onClick={onClose}>
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
};

export default CartDrawer;
