document.addEventListener('DOMContentLoaded', () => {
    const orderSummaryContainer = document.querySelector('.order-summary-container');
    const checkoutForm = document.getElementById('checkout-form');
    
    const cardNumberInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('expiry');
    const cvvInput = document.getElementById('cvv');
    const payNowBtn = document.getElementById('pay-now-btn');

    // --- Custom Warning Modal Elements ---
    const leavePageModal = document.getElementById('leave-page-modal');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const leaveBtn = document.getElementById('modal-leave-btn');
    const allLinks = document.querySelectorAll('a');
    let allowNavigation = false;
    let navigateToUrl = '';

    const TAX_RATE = 0.18;

    // full cart from localStorage first.
    const fullCart = getCart(); 
    // list of IDs for the items the user actually wants to buy.
    const itemsToCheckoutIds = JSON.parse(sessionStorage.getItem('itemsToCheckout')) || [];
    // temporary cart with only the selected items.
    const checkoutCart = fullCart.filter(item => itemsToCheckoutIds.includes(item.id));


    // --- Renders the order summary on the side (Updated) ---
    function renderOrderSummary() {
        if (!orderSummaryContainer) return;

        if (checkoutCart.length === 0) {
            checkoutForm.style.display = 'none';
            const title = document.querySelector('.category-title');
            if(title) title.textContent = "NO ITEMS SELECTED FOR CHECKOUT ";
            orderSummaryContainer.innerHTML = '<a href="cart.html" class="btn primary-btn">Back to Cart</a>';
            return;
        }

        const subtotal = checkoutCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const taxes = subtotal * TAX_RATE;
        const total = subtotal + taxes;

        orderSummaryContainer.innerHTML = `
            <div class="cart-summary">
                <h2>SUMMARY</h2>
                <div id="summary-items">
                    ${checkoutCart.map(item => `
                        <div class="summary-item">
                            <span>${item.title} (x${item.quantity})</span>
                            <span>₹${formatToIndianRupees(item.price * item.quantity)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>₹${formatToIndianRupees(subtotal)}</span>
                </div>
                <div class="summary-row">
                    <span>Taxes (18% GST)</span>
                    <span>₹${formatToIndianRupees(taxes)}</span>
                </div>
                <div class="summary-total">
                    <span>TOTAL</span>
                    <span>₹${formatToIndianRupees(total)}</span>
                </div>
            </div>
        `;
    }

    // --- Validation Logic ---
    const enforceNumericInput = (event) => {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
    };
    cardNumberInput.addEventListener('input', enforceNumericInput);
    expiryInput.addEventListener('input', enforceNumericInput);
    cvvInput.addEventListener('input', enforceNumericInput);
    
    const isNumeric = (value) => /^[0-9]+$/.test(value);
    
    const validateCardNumber = () => {
        const errorEl = document.getElementById('card-number-error');
        const value = cardNumberInput.value.replace(/\s/g, '');
        if (value.length !== 16 || !isNumeric(value)) {
            errorEl.textContent = 'Please enter a valid 16-digit card number.';
            errorEl.style.display = 'block';
            cardNumberInput.classList.add('invalid');
            return false;
        }
        errorEl.style.display = 'none';
        cardNumberInput.classList.remove('invalid');
        return true;
    };

    const validateExpiry = () => {
        const errorEl = document.getElementById('expiry-error');
        const value = expiryInput.value.replace('/', '');
        if (value.length !== 4 || !isNumeric(value)) {
            errorEl.textContent = 'Please use MMYY format.';
            errorEl.style.display = 'block';
            expiryInput.classList.add('invalid');
            return false;
        }
        errorEl.style.display = 'none';
        expiryInput.classList.remove('invalid');
        return true;
    };

    const validateCvv = () => {
        const errorEl = document.getElementById('cvv-error');
        const value = cvvInput.value;
        if (value.length !== 3 || !isNumeric(value)) {
            errorEl.textContent = 'Please enter a valid 3-digit CVV.';
            errorEl.style.display = 'block';
            cvvInput.classList.add('invalid');
            return false;
        }
        errorEl.style.display = 'none';
        cvvInput.classList.remove('invalid');
        return true;
    };
    
    cardNumberInput.addEventListener('blur', validateCardNumber);
    expiryInput.addEventListener('blur', validateExpiry);
    cvvInput.addEventListener('blur', validateCvv);
    
    // --- Form Submission  ---
    payNowBtn.addEventListener('click', () => {
        const isCardValid = validateCardNumber();
        const isExpiryValid = validateExpiry();
        const isCvvValid = validateCvv();
        const isFormValid = checkoutForm.checkValidity();

        if (isCardValid && isExpiryValid && isCvvValid && isFormValid) {
            allowNavigation = true; 

            // items that were NOT checked out.
            const remainingCartItems = fullCart.filter(item => !itemsToCheckoutIds.includes(item.id));
            
            // smaller list back to the main cart.
            saveCart(remainingCartItems);

            sessionStorage.removeItem('itemsToCheckout');
            
            localStorage.setItem('showOrderConfirmation', 'true');
            window.location.href = 'index.html';
        } else {
            checkoutForm.reportValidity();
            showToast('Please correct the errors before proceeding.');
        }
    });

    // --- Custom Warning Modal Logic---
    const handleLinkClick = (event) => {
        if (allowNavigation) {
            return; 
        }
        event.preventDefault();
        navigateToUrl = event.currentTarget.href;
        leavePageModal.classList.add('show');
    };

    allLinks.forEach(link => {
        if (link.href && link.target !== '_blank' && !link.href.includes('#') && !link.classList.contains('btn')) {
            link.addEventListener('click', handleLinkClick);
        }
    });

    cancelBtn.addEventListener('click', () => {
        leavePageModal.classList.remove('show');
    });

    leaveBtn.addEventListener('click', () => {
        allowNavigation = true;
        window.location.href = navigateToUrl;
    });
    
    // --- Initial Load ---
    renderOrderSummary();
    updateCartIcon();
});