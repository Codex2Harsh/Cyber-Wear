document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const resultsTitle = document.getElementById('search-results-title');
    const sortBy = document.getElementById('sort-by');

    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    let products = [];
    if (query) {
        const sanitizedQuery = query.toLowerCase().trim();
        resultsTitle.innerHTML = `SEARCH RESULTS FOR "<span class="neon-text">${query}</span>" //`;
        products = PRODUCTS.filter(product => {
            const titleMatch = product.title.toLowerCase().includes(sanitizedQuery);
            const descriptionMatch = product.description.toLowerCase().includes(sanitizedQuery);
            return titleMatch || descriptionMatch;
        });
    } else {
        resultsTitle.innerHTML = `PLEASE ENTER A SEARCH TERM //`;
    }

    const sortAndRender = () => {
        const sortValue = sortBy.value;
        let sortedProducts = [...products];

        if (sortValue === 'price-asc') {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-desc') {
            sortedProducts.sort((a, b) => b.price - a.price);
        } else if (sortValue === 'rating-desc') {
            sortedProducts.sort((a, b) => b.rating - a.rating);
        }

        renderProductCards(sortedProducts, productGrid);
    };

    sortAndRender();
    updateCartIcon();

    sortBy.addEventListener('change', sortAndRender);
    
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
            button.textContent = button.classList.contains('active') ? 'Wishlisted' : 'Add to Wishlist';
        }
    });
});