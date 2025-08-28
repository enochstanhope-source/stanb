document.addEventListener('DOMContentLoaded', () => {
    // Ensure zoom is always 100%
    document.body.style.zoom = "100%";
    
    setupCollectionTabs();
    setupBrandFilters();
    setupAddToCartButtons();
    updateCartCount();
    setupSearch();
    
    // Check for search parameter from index.html
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
        document.getElementById('shopSearch').value = searchQuery;
        filterProducts(searchQuery);
    }

    // Add resize event listener to maintain zoom
    window.addEventListener('resize', () => {
        document.body.style.zoom = "100%";
    });

    // Profile Modal Functionality
    const accountIcon = document.querySelector('.account-icon');
    const profileModal = document.getElementById('profileModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const saveBtn = document.querySelector('.save-btn');

    function showModal() {
        profileModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        profileModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    accountIcon.addEventListener('click', (e) => {
        e.preventDefault();
        showModal();
    });

    closeModal.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);
    saveBtn.addEventListener('click', () => {
        // Here you can add logic to save any changes
        hideModal();
    });

    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            hideModal();
        }
    });

    // Keyboard event for closing modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && profileModal.classList.contains('active')) {
            hideModal();
        }
    });

    // Create Store Button Functionality
    const createStoreBtn = document.querySelector('.create-store-btn');
    
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

        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Remove toast after animation
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    createStoreBtn.addEventListener('click', () => {
        showToast('Feature coming soon!');
    });

    // Edit Profile Button Functionality
    const editProfileBtn = document.querySelector('.edit-profile');
    
    editProfileBtn.addEventListener('click', () => {
        showToast('Please log in to edit your profile');
    });
});

function setupCollectionTabs() {
    const collectionTabs = document.querySelectorAll('.collections-tabs .tab');
    const productCards = document.querySelectorAll('.product-card');

    collectionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            collectionTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');

            const collection = tab.getAttribute('data-collection');
            
            // Show all products if 'all' is selected
            if (collection === 'all') {
                productCards.forEach(card => card.style.display = 'block');
                return;
            }

            // Filter products based on collection
            productCards.forEach(card => {
                const cardCollection = card.getAttribute('data-collection');
                card.style.display = cardCollection === collection ? 'block' : 'none';
            });
        });
    });
}

function setupBrandFilters() {
    const brandButtons = document.querySelectorAll('.brand-btn');
    const productCards = document.querySelectorAll('.product-card');
    const productCardsArray = Array.from(productCards);

    const filterProducts = (selectedBrand) => {
        requestAnimationFrame(() => {
            productCardsArray.forEach(card => {
                card.style.display = (selectedBrand === 'all' || card.dataset.brand === selectedBrand) ? 'block' : 'none';
            });
        });
    };

    const container = brandButtons[0]?.parentElement;
    if (container) {
        container.addEventListener('click', (e) => {
            const button = e.target.closest('.brand-btn');
            if (!button) return;

            brandButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterProducts(button.dataset.brand);
        });
    }
}

function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('img').src;
            
            const product = {
                id: generateProductId(productName),
                name: productName,
                price: parseFloat(productPrice.replace('₦', '').replace(',', '')),
                image: productImage,
                brand: productCard.dataset.brand
            };
            
            addToCart(product);
            updateCartCount();
            showAddToCartAnimation(button);
        });
    });
}

function generateProductId(productName) {
    return productName.toLowerCase().replace(/\s+/g, '-');
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };
    
    const existingItem = cart.items.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push({
            ...product,
            quantity: 1
        });
    }
    
    cart.total = calculateTotal(cart.items);
    localStorage.setItem('cart', JSON.stringify(cart));
}

function calculateTotal(items) {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
    const count = cart.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCount = document.querySelector('.cart-icon span');
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.animation = 'none';
        void cartCount.offsetWidth; // Trigger reflow
        cartCount.style.animation = 'blinkNumber 0.7s ease-in-out 4';
    }
}

function showAddToCartAnimation(button) {
    const originalText = button.textContent;
    button.textContent = '✓ Added!';
    button.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '#570123';
    }, 1500);
}

function setupSearch() {
    const searchInput = document.getElementById('shopSearch');
    const searchButton = document.querySelector('.search-button');
    let searchTimeout;

    function debounceSearch(value) {
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => filterProducts(value), 300);
    }

    // Search on button click
    searchButton.addEventListener('click', () => {
        if (searchTimeout) clearTimeout(searchTimeout);
        filterProducts(searchInput.value);
    });

    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (searchTimeout) clearTimeout(searchTimeout);
            filterProducts(searchInput.value);
        }
    });

    // Debounced live search as user types
    searchInput.addEventListener('input', (e) => debounceSearch(e.target.value));
}

function filterProducts(query) {
    const productCards = document.querySelectorAll('.product-card');
    const searchTerm = query.toLowerCase().trim();

    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productBrand = card.dataset.brand.toLowerCase();
        
        if (productName.includes(searchTerm) || productBrand.includes(searchTerm)) {
            card.style.display = 'block';
            
            // If it's a brand match, activate the corresponding brand filter
            if (productBrand.includes(searchTerm)) {
                const brandButton = document.querySelector(`.brand-btn[data-brand="${productBrand}"]`);
                if (brandButton) {
                    document.querySelectorAll('.brand-btn').forEach(btn => btn.classList.remove('active'));
                    brandButton.classList.add('active');
                }
            }
        } else {
            card.style.display = 'none';
        }
    });
}
