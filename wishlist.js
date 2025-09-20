document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const sortBy = document.getElementById('sort-by');
    const clearWishlistBtn = document.getElementById('clear-wishlist-btn');

    const sortAndRender = () => {
        const wishlist = getWishlist();
        let products = PRODUCTS.filter(product => wishlist.includes(product.id));
        const sortValue = sortBy.value;

        if (sortValue === 'price-asc') {
            products.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-desc') {
            products.sort((a, b) => b.price - a.price);
        } else if (sortValue === 'rating-desc') {
            products.sort((a, b) => b.rating - a.rating);
        }

        renderProductCards(products, productGrid);
        
        if (products.length === 0) {
            clearWishlistBtn.style.display = 'none';
        } else {
            clearWishlistBtn.style.display = 'inline-block';
        }
    };

    sortAndRender();
    updateCartIcon();

    sortBy.addEventListener('change', sortAndRender);

    clearWishlistBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your entire wishlist?')) {
            localStorage.removeItem('cyberWearWishlist');
            sortAndRender(); 
        }
    });

    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            e.preventDefault();
            const card = e.target.closest('.product-card');
            addToCart(card.dataset.productId);
        }
        if (e.target.classList.contains('add-to-wishlist-btn')) {
            e.preventDefault();
            const card = e.target.closest('.product-card');
            addToWishlist(card.dataset.productId);
            sortAndRender();
        }
    });
});