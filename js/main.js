// --- State ---
export let products = [];
let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];

// --- API / Data ---
export async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) throw new Error('Error al cargar productos');
        products = await response.json();
        return products;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// --- Cart Logic ---
export function getCart() {
    return cart;
}

export function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
}

export function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

export function updateQuantity(productId, newQty) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, newQty);
        saveCart();
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
}

export function updateCartUI() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        countElement.textContent = totalItems;
    }
}

// --- Initialization ---
async function init() {
    updateCartUI();
    
    // Cargar productos antes de cualquier otra cosa
    await loadProducts();

    // Renderizar si estamos en la página de inicio
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        renderProducts(productGrid);
    }

    // Disparar un evento para que otras páginas sepan que los productos están listos
    document.dispatchEvent(new CustomEvent('productsLoaded'));
}

function renderProducts(container) {
    if (products.length === 0) {
        container.innerHTML = '<p>No se pudieron cargar los productos.</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <a href="producto.html?id=${product.id}" class="product-link">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <span class="price">$${product.price.toFixed(2)}</span>
                </div>
            </a>
            <div class="product-info" style="padding-top: 0;">
                <button class="btn-primary btn-block" onclick="window.addToCart(${product.id})">Añadir al Carrito</button>
            </div>
        </div>
    `).join('');
}

// Hacer addToCart accesible desde el HTML (onclick)
window.addToCart = addToCart;

// Iniciar app automáticamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
