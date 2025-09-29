document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTaxes = document.getElementById('summary-taxes');
    const summaryTotal = document.getElementById('summary-total');
    const selectAllBtn = document.getElementById('select-all-btn');
    const deselectAllBtn = document.getElementById('deselect-all-btn');
    const emptyCartBtn = document.getElementById('empty-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    const TAX_RATE = 0.18;

    function renderCart() {
        const cart = getCart();
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-message">YOUR CART IS CURRENTLY EMPTY // <a href="index.html">START SHOPPING</a></div>';
            if(deselectAllBtn) deselectAllBtn.style.display = 'none';
            if(selectAllBtn) selectAllBtn.style.display = 'none';
            if(emptyCartBtn) emptyCartBtn.style.display = 'none';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => {
                const formattedPrice = formatToIndianRupees(item.price);
                return `
                    <div class="cart-item" data-product-id="${item.id}">
                        <label class="checkbox-container">
                            <input type="checkbox" class="item-checkbox" checked>
                            <span class="checkmark"></span>
                        </label>
                        <a href="product-detail.html?id=${item.id}" class="cart-item-link">
                            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                            <div class="cart-item-details">
                                <h4 class="cart-item-title">${item.title}</h4>
                                <p class="cart-item-price">₹${formattedPrice}</p>
                            </div>
                        </a>
                        <div class="cart-item-actions">
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                            <button class="remove-btn">✖</button>
                        </div>
                    </div>
                `;
            }).join('');
            if(deselectAllBtn) deselectAllBtn.style.display = 'inline-block';
            if(selectAllBtn) selectAllBtn.style.display = 'inline-block';
            if(emptyCartBtn) emptyCartBtn.style.display = 'inline-block';
        }
        updateSummary();
    }

    function updateSummary() {
        const cart = getCart();
        let subtotalINR = 0;

        document.querySelectorAll('.cart-item').forEach(itemElement => {
            const checkbox = itemElement.querySelector('.item-checkbox');
            if (checkbox && checkbox.checked) {
                const productId = itemElement.dataset.productId;
                const cartItem = cart.find(p => p.id === productId);
                if (cartItem) {
                    subtotalINR += cartItem.price * cartItem.quantity;
                }
            }
        });

        const taxesINR = subtotalINR * TAX_RATE;
        const totalINR = subtotalINR + taxesINR;
        const formatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

        summarySubtotal.textContent = `₹${formatter.format(subtotalINR)}`;
        summaryTaxes.textContent = `₹${formatter.format(taxesINR)}`;
        summaryTotal.textContent = `₹${formatter.format(totalINR)}`;
    }

    // Updates the quantity of an item in the cart
    function updateQuantity(productId, newQuantity) {
        let cart = getCart();
        const item = cart.find(p => p.id === productId);
        if (item && newQuantity > 0) {
            item.quantity = newQuantity;
            saveCart(cart);
            renderCart();
        }
    }

    // Removes an item from the cart
    function removeItem(productId) {
        let cart = getCart().filter(p => p.id !== productId);
        saveCart(cart);
        renderCart(); // Re-render the cart to show the item has been removed
        updateCartIcon(); // Update the header icon
    }

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const itemElement = e.target.closest('.cart-item');
            removeItem(itemElement.dataset.productId);
        }
    });

    cartItemsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const itemElement = e.target.closest('.cart-item');
            const newQuantity = parseInt(e.target.value, 10);
            updateQuantity(itemElement.dataset.productId, newQuantity);
        }
        if (e.target.classList.contains('item-checkbox')) {
            updateSummary();
        }
    });


    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const selectedItems = [];
            document.querySelectorAll('.item-checkbox:checked').forEach(checkbox => {
                const itemElement = checkbox.closest('.cart-item');
                selectedItems.push(itemElement.dataset.productId);
            });

            if (selectedItems.length === 0) {
                alert("Please select at least one item to check out.");
                return;
            }
            sessionStorage.setItem('itemsToCheckout', JSON.stringify(selectedItems));
            window.location.href = 'checkout.html';
        });
    }

    if(selectAllBtn) {
        selectAllBtn.addEventListener('click', () => {
            document.querySelectorAll('.item-checkbox').forEach(checkbox => {
                checkbox.checked = true;
            });
            updateSummary();
        });
    }

    if(deselectAllBtn) {
        deselectAllBtn.addEventListener('click', () => {
            document.querySelectorAll('.item-checkbox').forEach(checkbox => {
                checkbox.checked = false;
            });
            updateSummary();
        });
    }
    
    if(emptyCartBtn) {
        emptyCartBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to empty your cart? This action cannot be undone.')) {
                localStorage.removeItem('cyberWearCart');
                renderCart();
                updateCartIcon();
            }
        });
    }

    renderCart();
    updateCartIcon();
});