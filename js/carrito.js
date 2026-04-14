import { getCart, removeFromCart, updateQuantity } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (getCart().length === 0) {
                alert('Tu carrito está vacío.');
            } else {
                window.location.href = 'checkout.html';
            }
        });
    }
});

function renderCart() {
    const cart = getCart();
    const container = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<div class="loading">Tu carrito está vacío. <a href="index.html">Ve a la tienda</a></div>`;
        subtotalEl.textContent = '$0.00';
        totalEl.textContent = '$0.00';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="window.changeQty(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="window.changeQty(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="window.handleRemove(${item.id})">Eliminar</button>
            </div>
            <div class="cart-item-price">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    subtotalEl.textContent = `$${total.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

// Helpers globales para los eventos onclick
window.changeQty = (id, delta) => {
    const item = getCart().find(i => i.id === id);
    if (item) {
        updateQuantity(id, item.quantity + delta);
        renderCart();
    }
};

window.handleRemove = (id) => {
    removeFromCart(id);
    renderCart();
};
