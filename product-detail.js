document.addEventListener('DOMContentLoaded', () => {
    const productDetailContainer = document.getElementById('product-detail-container');
    const similarProductsGrid = document.getElementById('similar-products-grid');

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const product = PRODUCTS.find(p => p.id === productId);

    if (product) {
        document.title = `${product.title} // CYBER-WEAR`;
        renderProductDetails(product);
        const similarProducts = PRODUCTS.filter(
            p => p.category === product.category && p.id !== product.id
        ).slice(0, 3);
        if (similarProducts.length > 0) {
            renderProductCards(similarProducts, similarProductsGrid);
        } else {
            document.getElementById('similar-products-section').style.display = 'none';
        }
    } else {
        productDetailContainer.innerHTML = `<h1 class="category-title">PRODUCT NOT FOUND // 404</h1>`;
    }

    updateCartIcon();

    //listener for the main product's action buttons
    productDetailContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn-detail')) {
            const productId = e.target.dataset.productId;
            addToCart(productId);
        }
        //  Logic for the main product's wishlist button
        if (e.target.classList.contains('add-to-wishlist-btn-detail')) {
            const button = e.target;
            const productId = button.dataset.productId;
            addToWishlist(productId); // This function is in common.js
            
            button.classList.toggle('active');
            button.textContent = button.classList.contains('active') ? 'Wishlisted' : 'Add to Wishlist';
        }
    });

    //  New listener for the "Similar Products" grid
    similarProductsGrid.addEventListener('click', (e) => {
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

function renderProductDetails(product) {
    const productDetailContainer = document.getElementById('product-detail-container');
    const formattedPrice = formatToIndianRupees(product.price);
    
    // Check if the product is already in the wishlist
    const wishlist = getWishlist();
    const isWishlisted = wishlist.includes(product.id);

    let displayStars = '';
    for (let i = 0; i < 5; i++) {
        if (i < Math.floor(product.rating)) displayStars += '★';
        else displayStars += '☆';
    }

    productDetailContainer.innerHTML = `
        <div class="product-detail-image-wrapper">
            <img src="${product.image}" alt="${product.title}" class="product-detail-image">
        </div>
        <div class="product-detail-info">
            <h1 class="product-detail-title">${product.title}</h1>
            <p class="product-detail-category">${product.category}</p>
            <div class="product-detail-rating">
                <span class="stars">${displayStars}</span>
                <span class="reviews">(${product.reviews} reviews)</span>
            </div>
            <p class="product-detail-price"><span class="currency">₹</span> ${formattedPrice}</p>
            <p class="product-detail-description">${product.description} This is where a more detailed brief about the product would go, explaining the materials, fit, and futuristic features.</p>
            
            <div class="product-detail-actions">
                <button class="btn primary-btn add-to-cart-btn-detail" data-product-id="${product.id}">Add to Cart</button>
                <button class="btn add-to-wishlist-btn-detail ${isWishlisted ? 'active' : ''}" data-product-id="${product.id}">
                    ${isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
            </div>

            <div class="reviews-section">
                <h3>REVIEWS //</h3>
                <div class="review">
                    <p class="review-author"><strong>Alex_Cybr</strong> - ★★★★★</p>
                    <p class="review-text">Absolutely stunning jacket. The neon circuits are brighter than expected and it's surprisingly comfortable. A must-have for any neo-punk enthusiast!</p>
                </div>
                 <div class="review">
                    <p class="review-author"><strong>NetRunner_77</strong> - ★★★★☆</p>
                    <p class="review-text">Great quality and looks amazing. Wish it had more internal pockets for my gear, but overall a solid piece of tech-wear.</p>
                </div>
            </div>
        </div>
    `;
}