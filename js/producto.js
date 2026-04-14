import { products, addToCart } from './main.js';

function initProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    const container = document.getElementById('product-detail');

    if (!container) return;

    const product = products.find(p => p.id === productId);

    if (!product) {
        container.innerHTML = `<h2>Producto no encontrado</h2><a href="index.html">Volver a la tienda</a>`;
        return;
    }

    renderProductDetail(container, product);
}

// Escuchar el evento, pero también intentar cargar inmediatamente por si ya terminó main.js
document.addEventListener('productsLoaded', initProductDetail);

// Intentar inicializar (por si los módulos ya cargaron los datos)
if (products.length > 0) {
    initProductDetail();
}

function renderProductDetail(container, product) {
    container.innerHTML = `
        <div class="detail-img">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="detail-info">
            <h1>${product.name}</h1>
            <span class="price">$${product.price.toFixed(2)}</span>
            <p>${product.description}</p>
            <div class="detail-actions">
                <button class="btn-primary" id="add-to-cart-btn">Añadir al Carrito</button>
                <a href="index.html" class="btn-secondary">Volver</a>
            </div>
        </div>
    `;

    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
        addToCart(product.id);
        alert('¡Producto añadido al carrito!');
    });
}
