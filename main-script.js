document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const searchBar = document.querySelector('.search-bar');
    const confirmationModal = document.getElementById('confirmation-modal');
    const modalOkBtn = document.getElementById('modal-ok-btn');

    if (localStorage.getItem('showOrderConfirmation') === 'true') {
        confirmationModal.classList.add('show');
        localStorage.removeItem('showOrderConfirmation');
    }

    modalOkBtn.addEventListener('click', () => {
        confirmationModal.classList.remove('show');
    });

    const newJackets = PRODUCTS.filter(p => p.category === 'Outerwear').slice(0, 3);
    const newHoodies = PRODUCTS.filter(p => p.category === 'Hoodies').slice(0, 2);
    const newPants = PRODUCTS.filter(p => p.category === 'Pants').slice(0, 2);
    const newAccessories = PRODUCTS.filter(p => p.category === 'Accessories').slice(0, 3);
    const newArrivals = [...newJackets, ...newHoodies, ...newPants, ...newAccessories];

    renderProductCards(newArrivals, productGrid);

   
    updateCartIcon();
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            e.preventDefault();
            const card = e.target.closest('.product-card');
            addToCart(card.dataset.productId);
        }
        if (e.target.classList.contains('add-to-wishlist-btn')) {
            e.preventDefault();
            const card = e.target.closest('.product-card');
            const button = e.target;

            addToWishlist(card.dataset.productId);

            button.classList.toggle('active');
            if (button.classList.contains('active')) {
                button.textContent = 'Wishlisted';
            } else {
                button.textContent = 'Add to Wishlist';
            }
        }
    });
});