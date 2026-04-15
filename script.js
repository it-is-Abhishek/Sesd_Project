const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const cartButton = document.getElementById('cartButton');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartBody = document.getElementById('cartBody');
const addButtons = document.querySelectorAll('.add-to-cart');
let cartItems = [];

menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

cartButton?.addEventListener('click', () => {
  cartModal.classList.add('active');
  cartModal.setAttribute('aria-hidden', 'false');
});

closeCart?.addEventListener('click', () => {
  cartModal.classList.remove('active');
  cartModal.setAttribute('aria-hidden', 'true');
});

cartModal?.addEventListener('click', (event) => {
  if (event.target === cartModal) {
    cartModal.classList.remove('active');
    cartModal.setAttribute('aria-hidden', 'true');
  }
});

function renderCart() {
  if (!cartItems.length) {
    cartBody.innerHTML = '<p class="empty-cart">Your cart is empty. Add a product to start.</p>';
    cartCount.textContent = '0';
    return;
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartBody.innerHTML = `
    <div class="cart-list">
      ${cartItems
        .map(
          (item) => `
          <div class="cart-item">
            <div>
              <strong>${item.name}</strong>
              <p>Qty: ${item.quantity} · $${item.price}</p>
            </div>
            <button class="btn btn-sm remove-item" data-name="${item.name}">Remove</button>
          </div>`
        )
        .join('')}
    </div>
    <div class="cart-total">
      <strong>Total</strong>
      <span>$${total.toFixed(2)}</span>
    </div>
  `;

  cartCount.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  document.querySelectorAll('.remove-item').forEach((button) => {
    button.addEventListener('click', () => {
      const name = button.getAttribute('data-name');
      cartItems = cartItems.filter((item) => item.name !== name);
      renderCart();
    });
  });
}

addButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    const name = card?.getAttribute('data-name');
    const price = Number(card?.getAttribute('data-price')) || 0;
    if (!name) return;

    const existing = cartItems.find((item) => item.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems.push({ name, price, quantity: 1 });
    }

    renderCart();
    cartModal.classList.add('active');
    cartModal.setAttribute('aria-hidden', 'false');
  });
});

renderCart();
