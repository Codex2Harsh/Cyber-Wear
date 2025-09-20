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
            cartItemsContainer.innerHTML = '<div class="empty-cart-message">YOUR CART IS EMPTY // <a href="index.html">START SHOPPING</a></div>';
            deselectAllBtn.style.display = 'none';
            selectAllBtn.style.display = 'none';
            emptyCartBtn.style.display = 'none';
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
            deselectAllBtn.style.display = 'inline-block';
            selectAllBtn.style.display = 'inline-block';
            emptyCartBtn.style.display = 'inline-block';
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

    // --- THIS IS THE NEW LOGIC FOR THE CHECKOUT BUTTON ---
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

        // Save the selected items to sessionStorage to be used on the checkout page
        sessionStorage.setItem('itemsToCheckout', JSON.stringify(selectedItems));

        // Go to the checkout page
        window.location.href = 'checkout.html';
    });
    selectAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.checked = true;
        });
        updateSummary();
    });

    deselectAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        updateSummary();
    });

    emptyCartBtn.addEventListener('click', () => {
        if (confirm('Sure to empty your cart? Think Again!')) {
            localStorage.removeItem('cyberWearCart');
            renderCart();
            updateCartIcon();
        }
    });

    cartItemsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('item-checkbox') || e.target.classList.contains('quantity-input')) {
            updateSummary();
        }
    });

    

    renderCart();
    updateCartIcon();
});