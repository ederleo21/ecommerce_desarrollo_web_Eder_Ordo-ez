import { getCart } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    const cart = getCart();
    if (cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }

    renderSummary(cart);
    setupPaymentForm();
});

function renderSummary(cart) {
    const container = document.getElementById('checkout-summary-items');
    const totalEl = document.getElementById('checkout-total');

    container.innerHTML = cart.map(item => `
        <div class="summary-line">
            <span>${item.name} (x${item.quantity})</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    totalEl.textContent = `$${total.toFixed(2)}`;
}

function setupPaymentForm() {
    const form = document.getElementById('payment-form');
    const payBtn = document.getElementById('pay-btn');
    const statusMsg = document.getElementById('payment-status');

    // Formateo de tarjeta (espacios cada 4 números)
    document.getElementById('card-number').addEventListener('input', (e) => {
        let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formatted = val.match(/.{1,4}/g)?.join(' ') || '';
        e.target.value = formatted;
    });

    // Formateo de fecha (MM/YY)
    document.getElementById('card-exp').addEventListener('input', (e) => {
        let val = e.target.value.replace(/\//g, '').replace(/[^0-9]/gi, '');
        if (val.length >= 2) {
            val = val.slice(0, 2) + '/' + val.slice(2, 4);
        }
        e.target.value = val;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulación de procesamiento
        payBtn.disabled = true;
        payBtn.textContent = 'Procesando...';
        statusMsg.textContent = 'Conectando con Aura Pay...';
        statusMsg.className = 'status-msg processing';

        setTimeout(() => {
            statusMsg.textContent = 'Verificando seguridad...';
            
            setTimeout(() => {
                // Éxito
                statusMsg.textContent = '¡Pago Exitoso! Redirigiendo...';
                statusMsg.className = 'status-msg success';
                
                // Limpiar carrito
                localStorage.removeItem('aura_cart');
                
                setTimeout(() => {
                    window.location.href = 'index.html?purchase=success';
                }, 2000);
            }, 1500);
        }, 1500);
    });
}
