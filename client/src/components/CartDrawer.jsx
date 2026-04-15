import { Link } from 'react-router-dom';

const CartDrawer = ({ cart, open, onClose, onRemove }) => {
  if (!open) return null;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-drawer-backdrop" onClick={onClose}>
      <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="cart-drawer-header">
          <h3>Your cart</h3>
          <button className="icon-button" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty. Add items to continue.</p>
        ) : (
          <div className="cart-drawer-body">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.quantity} × ${item.price}</p>
                </div>
                <button className="btn btn-sm remove-item" onClick={() => onRemove(item.id)}>
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
