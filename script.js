const products = [
    { id: 1, name: 'Açaí Tradicional', price: 15, category: 'Açaí' },
    { id: 2, name: 'Sorvete de Chocolate', price: 12, category: 'Sorvetes' },
    { id: 3, name: 'Granola', price: 2, category: 'Toppings' },
    { id: 4, name: 'Água Mineral', price: 3, category: 'Bebidas' }
];

let cart = {};
let paymentMethod = '';
let changeNeeded = '';
let changeToTake = 0;
let orderType = '';
let customerAddress = '';
let customerName = '';
let customerPhone = '';

document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartIcon = document.getElementById('cart-icon');
    const cartElement = document.getElementById('cart');
    const cartItemsElement = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const paymentMethodElement = document.getElementById('payment-method');
    const changeNeededElement = document.getElementById('change-needed');
    const changeInfoElement = document.getElementById('change-info');
    const changeToTakeElement = document.getElementById('change-to-take');
    const checkoutTotalElement = document.getElementById('checkout-total');
    const checkoutButton = document.getElementById('checkout-button');
    const orderTypeElement = document.getElementById('order-type');
    const deliveryInfoElement = document.getElementById('delivery-info');
    const customerAddressElement = document.getElementById('customer-address');
    const customerNameElement = document.getElementById('customer-name');
    const customerPhoneElement = document.getElementById('customer-phone');

    // Exibe os produtos no menu
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('card');
        productCard.innerHTML = `
            <div class="card-header">
                <h3>${product.name} - R$${product.price.toFixed(2)}</h3>
            </div>
            <div class="card-content flex justify-between items-center">
                <span>${product.category}</span>
                <div>
                    <button onclick="removeFromCart(${product.id})">-</button>
                    <span id="quantity-${product.id}">0</span>
                    <button onclick="addToCart(${product.id})">+</button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });

    // Abre/fecha o carrinho
    cartIcon.addEventListener('click', () => {
        cartElement.classList.toggle('hidden');
    });

    // Atualiza a quantidade de produtos no carrinho
    function updateCart() {
        cartItemsElement.innerHTML = '';
        Object.entries(cart).forEach(([productId, quantity]) => {
            const product = products.find(p => p.id === parseInt(productId));
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${product.name} x${quantity}</span>
                <div>
                    <button onclick="removeFromCart(${product.id})">-</button>
                    <button onclick="addToCart(${product.id})">+</button>
                </div>
            `;
            cartItemsElement.appendChild(cartItem);
        });
        if (Object.keys(cart).length === 0) {
            cartItemsElement.innerHTML = '<p>Seu carrinho está vazio.</p>';
        }
        updateTotalPrice();
    }

    // Adiciona um produto ao carrinho
    window.addToCart = function(productId) {
        if (!cart[productId]) {
            cart[productId] = 0;
        }
        cart[productId]++;
        document.getElementById(`quantity-${productId}`).innerText = cart[productId];
        document.getElementById('cart-count').innerText = Object.values(cart).reduce((a, b) => a + b, 0);
        updateCart();
    };

    // Remove um produto do carrinho
    window.removeFromCart = function(productId) {
        if (cart[productId]) {
            cart[productId]--;
            if (cart[productId] === 0) {
                delete cart[productId];
            }
            document.getElementById(`quantity-${productId}`).innerText = cart[productId] || 0;
            document.getElementById('cart-count').innerText = Object.values(cart).reduce((a, b) => a + b, 0);
            updateCart();
        }
    };

    // Calcula o preço total
    function updateTotalPrice() {
        const total = Object.entries(cart).reduce((total, [productId, quantity]) => {
            const product = products.find(p => p.id === parseInt(productId));
            return total + (product.price * quantity);
        }, 0);
        totalPriceElement.innerText = total.toFixed(2);
        checkoutTotalElement.innerText = total.toFixed(2);
    }

    // Atualiza método de pagamento
    paymentMethodElement.addEventListener('change', (e) => {
        paymentMethod = e.target.value;
        if (paymentMethod === 'Dinheiro') {
            document.getElementById('cash-change').classList.remove('hidden');
        } else {
            document.getElementById('cash-change').classList.add('hidden');
        }
    });

    // Atualiza tipo de pedido
    orderTypeElement.addEventListener('change', (e) => {
        orderType = e.target.value;
        if (orderType === 'Entrega a Domicílio') {
            deliveryInfoElement.classList.remove('hidden');
        } else {
            deliveryInfoElement.classList.add('hidden');
        }
    });

    // Atualiza endereço de entrega
    customerAddressElement.addEventListener('input', (e) => {
        customerAddress = e.target.value;
    });

    // Atualiza nome do cliente
    customerNameElement.addEventListener('input', (e) => {
        customerName = e.target.value;
    });

    // Atualiza telefone do cliente
    customerPhoneElement.addEventListener('input', (e) => {
        customerPhone = e.target.value;
    });

    // Calcula o troco
    changeNeededElement.addEventListener('input', (e) => {
        changeNeeded = parseFloat(e.target.value);
        const total = parseFloat(totalPriceElement.innerText);
        changeToTake = changeNeeded - total;
        if (changeToTake > 0) {
            changeInfoElement.classList.remove('hidden');
            changeToTakeElement.innerText = changeToTake.toFixed(2);
        } else {
            changeInfoElement.classList.add('hidden');
        }
    });

    // Finaliza o pedido
    checkoutButton.addEventListener('click', () => {
        if (!customerName || !customerPhone || !orderType || !paymentMethod) {
            alert("Por favor, preencha todas as informações do pedido.");
            return;
        }

        const orderSummary = Object.entries(cart).map(([productId, quantity]) => {
            const product = products.find(p => p.id === parseInt(productId));
            return `${product.name} x${quantity}`;
        }).join('\n');

        const message = `
Novo pedido:
${orderSummary}

Total: R$${checkoutTotalElement.innerText}
Forma de pagamento: ${paymentMethod}
${paymentMethod === 'Dinheiro' ? `Valor a receber: R$${changeNeeded}
Troco a ser levado: R$${changeToTake.toFixed(2)}` : ''}
Tipo de pedido: ${orderType}
${orderType === 'Entrega a Domicílio' ? `Endereço de entrega: ${customerAddress}` : 'Pedido será retirado na loja.'}

Cliente: ${customerName}
Contato: ${customerPhone}
        `;

        // Enviar para o WhatsApp
        const whatsappNumber = '+5585991993833'; // Número de WhatsApp da loja
        const whatsappLink = `https://wa.me/${+5585991993833}?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, '_blank');

        alert("Pedido enviado com sucesso!");
    });
});
