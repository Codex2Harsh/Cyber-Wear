
const USD_TO_INR_RATE = 83.00;


function formatToIndianRupees(inrPrice) {
    return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0
    }).format(inrPrice);
}


function showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }
}

// --- Cart Functions ---
function getCart() { return JSON.parse(localStorage.getItem('cyberWearCart')) || []; }
function saveCart(cart) { localStorage.setItem('cyberWearCart', JSON.stringify(cart)); updateCartIcon(); }
function addToCart(productId) {
    let cart = getCart();
    const productToAdd = PRODUCTS.find(p => p.id === productId);
    if (!productToAdd) return;
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) { existingItem.quantity++; } else { cart.push({ id: productToAdd.id, title: productToAdd.title, price: productToAdd.price, image: productToAdd.image, quantity: 1 }); }
    saveCart(cart);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.classList.add('updated');
        setTimeout(() => cartCountElement.classList.remove('updated'), 400);
    }
    showToast("Item added to cart!");
}
function updateCartIcon() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) { cartCountElement.textContent = totalItems; }
}

// --- Wishlist Functions ---
function getWishlist() { return JSON.parse(localStorage.getItem('cyberWearWishlist')) || []; }
function saveWishlist(wishlist) { localStorage.setItem('cyberWearWishlist', JSON.stringify(wishlist)); }
function addToWishlist(productId) {
    let wishlist = getWishlist();
    if (wishlist.includes(productId)) { wishlist = wishlist.filter(id => id !== productId); } else { wishlist.push(productId); }
    saveWishlist(wishlist);
}

// --- Rendering Function ---
function renderProductCards(products, targetElement) {
    if (!targetElement) return;
    const wishlist = getWishlist();
    if (products.length === 0) {
        targetElement.innerHTML = `<p class="empty-search-message">Time to make a Wish.</p>`;
    } else {
        targetElement.innerHTML = products.map(product => {
            const isWishlisted = wishlist.includes(product.id);
            let displayStars = '';
            for (let i = 0; i < 5; i++) { if (i < Math.floor(product.rating)) displayStars += '★'; else displayStars += '☆'; }
            const formattedPrice = formatToIndianRupees(product.price);
            return `<div class="product-card" data-product-id="${product.id}"><a href="product-detail.html?id=${product.id}" class="stretched-link"></a><img src="${product.image}" alt="${product.title}" class="product-image"><h3 class="product-title">${product.title}</h3><p class="product-category">${product.category}</p><p class="product-description">${product.description}</p><p class="product-price"><span class="currency">₹</span> ${formattedPrice}</p><div class="product-rating"><span class="stars">${displayStars}</span><span class="reviews">(${product.reviews} reviews)</span></div><div class="product-actions"><button class="btn add-to-cart-btn">Add to Cart</button><button class="btn add-to-wishlist-btn ${isWishlisted ? 'active' : ''}">${isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</button></div></div>`;
        }).join('');
    }
}

// ---Background Animation Logic ---
function launchParticles(theme) {
    const isLight = theme === 'light';
    const particleColor = isLight ? '#008a00' : '#14340fff'; // Dimmer green for light mode
    const lineColor = isLight ? '#008a00' : '#34ed14';
    const particleOpacity = isLight ? 0.6 : 0.5;

    // Check if particles.js is loaded
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": particleColor },
                "shape": { "type": "circle" },
                "opacity": { "value": particleOpacity, "random": true },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": lineColor, "opacity": 0.2, "width": 1 },
                "move": { "enable": true, "speed": 2, "direction": "none", "out_mode": "out" }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                "modes": { "repulse": { "distance": 100, "duration": 0.4 }, "push": { "particles_nb": 4 } }
            },
            "retina_detect": true
        });
    }
}


// This function runs immediately when any page loads to check for a saved theme
(function() {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
    }
})();

// This part adds the click functionality to the toggle switch
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    
    if (themeToggle) {
        // Set the toggle to the correct position on page load
        if (localStorage.getItem('theme') === 'light') {
            themeToggle.checked = true;
        }

        themeToggle.addEventListener('change', function() {
            // Add or remove the .light-mode class from the body
            document.body.classList.toggle('light-mode');

            // Save the user's preference in localStorage
            if (this.checked) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});