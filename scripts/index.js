// Loader functionality
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader-wrapper');
    // Prevent scrolling while loader is visible
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
      setTimeout(() => {
        loader.classList.add('loader-hidden');
        // Re-enable scrolling
        document.body.style.overflow = '';
        
        loader.addEventListener('transitionend', () => {
            if (loader.parentNode) {
                document.body.removeChild(loader);
            }
        }, 1600); // 2 seconds delay
        });
});

// Account and cart initialization
const init = () => {
    requestAnimationFrame(() => {
        document.body.style.zoom = "80%";
        
        // Update account text based on login status
        const userAccount = document.getElementById('guestAccount');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userName = localStorage.getItem('userFirstName');
        
        if (userAccount) {
            if (isLoggedIn && userName) {
                userAccount.innerHTML = `
                    <div class="account-wrapper">
                        <a href="#" class="account-link">
                            <i class="fas fa-user"></i>
                            <span>${userName}</span>
                        </a>
                        <ul class="dropdown-menu" id="userDropdown">
                            <li><a href="manage.html"><i class="fas fa-user-cog"></i>Manage Account</a></li>
                            <li><a href="cart.html"><i class="fas fa-shopping-bag"></i>My Orders</a></li>
                            <li><a href="#"><i class="fas fa-heart"></i>Wishlist</a></li>
                            <li><a href="#" onclick="handleLogout()"><i class="fas fa-sign-out-alt"></i>Sign Out</a></li>
                        </ul>
                    </div>`;
            } else {
                userAccount.innerHTML = `
                    <div class="account-wrapper">
                        <a href="#" class="account-link">
                            <i class="fas fa-user"></i>
                            <span>Account</span>
                        </a>
                        <ul class="dropdown-menu" id="guestDropdown">
                            <li><a href="login.html"><i class="fas fa-sign-in-alt"></i>Sign In</a></li>
                            <li><a href="signup.html"><i class="fas fa-user-plus"></i>Create Account</a></li>
                            <li><a href="#"><i class="fas fa-question-circle"></i>Help</a></li>
                        </ul>
                    </div>`;
            }
        }

        // Initialize cart and update counter
        initializeCart();
        updateCartCounter();
    });
};

// Initialize cart structure if it doesn't exist
function initializeCart() {
    if (!localStorage.getItem('cart')) {
        const cart = {
            items: [],
            total: 0,
            shipping: 0
        };
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    updateCartCounter();
}

// Update cart counter with animation
function updateCartCounter() {
    const cartCounter = document.querySelector('.cart-icon span');
    if (cartCounter) {
        const cart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
        const count = cart.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        cartCounter.textContent = count;
        cartCounter.style.animation = 'none';
        void cartCounter.offsetWidth; // Trigger reflow
        cartCounter.style.animation = 'blinkNumber 0.7s ease-in-out 4';
    }
}

// Direct cart counter update without animation
function updateCartCounterInstant() {
    const cartCounter = document.querySelector('.cart-icon span');
    if (cartCounter) {
        const cart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
        const count = cart.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCounter.textContent = count;
    }
}

// Add to cart function with instant update
function addToCart(product) {
    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0, shipping: 0 };
    
    // Add quantity property if not exists
    product.quantity = 1;
    
    // Check if product already exists in cart
    const existingItem = cart.items.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push(product);
    }
    
    // Calculate new total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.shipping = cart.total < 80000 && cart.total > 0 ? 1800 : 0;
    
    // Update counter before saving to localStorage for instant feedback
    const cartCounter = document.querySelector('.cart-icon span');
    if (cartCounter) {
        const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        // Update DOM before any other operations
        cartCounter.textContent = count;
    }
    
    // Save to localStorage after counter update
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show minimal toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = 'Added';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 500);
    
    return cart;
}

// Show toast notification
function showToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
        initializeCart();
        setupEventListeners();
    });
} else {
    init();
    initializeCart();
    setupEventListeners();
}

// Setup all event listeners
function setupEventListeners() {
    setupSearch();
    setupCart();
}

// Setup search functionality
function setupSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const searchBar = document.getElementById('searchBar');
    const closeSearch = document.querySelector('.close-search');
    const searchInput = document.querySelector('.search-input');

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchText = this.value.trim();
                if (searchText) {
                    window.location.href = `shop.html?search=${encodeURIComponent(searchText)}`;
                }
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const searchText = searchInput?.value.trim();
            if (searchText) {
                window.location.href = `shop.html?search=${encodeURIComponent(searchText)}`;
            } else {
                searchBar?.classList.add('active');
                searchInput?.focus();
            }
        });
    }

    if (closeSearch) {
        closeSearch.addEventListener('click', function() {
            searchBar?.classList.remove('active');
        });
    }

    document.addEventListener('click', function(e) {
        if (!searchBar?.contains(e.target) && !searchBtn?.contains(e.target)) {
            searchBar?.classList.remove('active');
        }
    });

    if (searchBar) {
        searchBar.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// Setup cart functionality
function setupCart() {
    const cartIcon = document.querySelector('.cart-icon');
    const buyNowButtons = document.querySelectorAll('.buy-now, .buy-now-hero');    // Add click handlers for buy now buttons
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card') || this.closest('.hero-image');
            if (!productCard) return;

            const productId = productCard.dataset.productId || productCard.querySelector('h3')?.textContent.toLowerCase().replace(/\s+/g, '-') || `product-${Date.now()}`;
            const productName = productCard.querySelector('h3')?.textContent;
            const priceText = productCard.querySelector('.price')?.textContent;
            const price = parseInt(priceText?.replace('₦', '').replace(/,/g, '') || '0');
            const image = productCard.querySelector('img')?.src;

            if (!productName || !price || !image) {
                console.error('Missing product details');
                return;
            }

            // Get current cart
            const cartData = localStorage.getItem('cart');
            let cart = cartData ? JSON.parse(cartData) : {
                items: [],
                total: 0,
                shipping: 0
            };

            // Find existing item
            const existingItem = cart.items.find(item => item.id === productId);
            
            if (existingItem) {
                // If item exists, increment its quantity
                existingItem.quantity += 1;
            } else {
                // If item doesn't exist, add it with quantity 1
                cart.items.push({
                    id: productId,
                    name: productName,
                    price: price,
                    image: image,
                    quantity: 1
                });
            }

            // Update cart totals
            cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Update shipping
            if (cart.total < 80000 && cart.total > 0) {
                cart.shipping = 1800;
            } else {
                cart.shipping = 0;
            }            // Update counter immediately before any other operations
            const cartCounter = document.querySelector('.cart-icon span');
            if (cartCounter) {
                const totalCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
                cartCounter.textContent = totalCount;
            }

            // Save cart
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Show minimal toast
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = 'Added';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 500);
            
            // Change button text temporarily
            const button = this;
            const originalText = button.textContent;
            button.textContent = 'Added to Cart';
            button.style.backgroundColor = '#4CAF50';
            
            // Reset button after 2 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 2000);
        });
    });

    // Navigate to cart page on cart icon click
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
}

// Handle logout function
function handleLogout() {
    // Clear login-related items from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('username');
    localStorage.removeItem('userPhone');
    
    // Show logout message
    showToast('Successfully signed out');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Slider functionality
let slideIndex = 1;
let slideInterval;
let isAnimating = false;

function initSlider() {
    showSlides(slideIndex);
    startAutoSlide();
}

function startAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 3000); // Change slide every 1 second
}

function changeSlide(n) {
    if (isAnimating) return;
    showSlides(slideIndex += n);
    resetAutoSlide();
}

function currentSlide(n) {
    if (isAnimating) return;
    showSlides(slideIndex = n);
    resetAutoSlide();
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    
    if (!slides.length) return;
    
    isAnimating = true;
    
    // Handle wraparound
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    
    // Reset all slides
    Array.from(slides).forEach(slide => {
        slide.style.display = "none";
        slide.className = slide.className.replace(" current", "");
        slide.className = slide.className.replace(" next", "");
        slide.className = slide.className.replace(" previous", "");
    });
    
    // Update dot indicators
    Array.from(dots).forEach(dot => {
        dot.className = dot.className.replace(" active", "");
    });
    
    // Set up the slides for animation
    let currentIndex = slideIndex - 1;
    let nextIndex = (currentIndex + 1) % slides.length;
    let previousIndex = currentIndex - 1;
    if (previousIndex < 0) previousIndex = slides.length - 1;
    
    // Display and position the slides
    slides[previousIndex].style.display = "block";
    slides[currentIndex].style.display = "block";
    slides[nextIndex].style.display = "block";
    
    slides[previousIndex].classList.add("previous");
    slides[currentIndex].classList.add("current");
    slides[nextIndex].classList.add("next");
    
    // Activate the corresponding dot
    dots[currentIndex].className += " active";
    
    // Reset animation flag after transition
    setTimeout(() => {
        isAnimating = false;
    }, 800);
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    
    // Add event listeners for hover pause
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    });
});

// Make functions available globally
window.addToCart = addToCart;
window.updateCartCounter = updateCartCounter;
window.handleLogout = handleLogout;