// Cart Class
class Cart {    constructor() {
        this.items = [];
        this.total = 0;
        this.shipping = 0;
        this.init();
    }

    init() {
        // Initialize with example items if cart is empty
        const savedCart = localStorage.getItem('cart');
        if (!savedCart) {
            this.items = [
                {
                    id: "1",
                    name: "Balenciaga Triple S",
                    price: 95000,
                    quantity: 1,
                    image: "images/a1.jpg"
                },
                {
                    id: "2",
                    name: "Puma RS-X",
                    price: 28000,
                    quantity: 1,
                    image: "images/a2.jpg"
                },
                {
                    id: "3",
                    name: "Nike Air Max",
                    price: 35000,
                    quantity: 1,
                    image: "images/a3.jpg"
                },
                {
                    id: "4",
                    name: "New Balance 574",
                    price: 45000,
                    quantity: 1,
                    image: "images/a4.jpg"
                }
            ];
            this.saveCart();
        } else {
            this.loadCart();
        }
        
        this.updateCartUI();
        this.setupPaystackCheckout();
        this.setupEventListeners();
        this.handlePaymentProof();
    }

    setupEventListeners() {
        // Add event listener for clear all button
        const clearAllBtn = document.querySelector('.clear-all-btn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearCart());
        }

        // Payment tab functionality
        const paymentTabs = document.querySelectorAll('.payment-tab');
        paymentTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                paymentTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                document.querySelectorAll('.payment-content').forEach(content => {
                    content.classList.add('hidden');
                });
                
                const contentId = tab.dataset.tab;
                document.getElementById(contentId)?.classList.remove('hidden');
            });
        });

        // Setup quantity controls using event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-btn')) {
                const itemId = e.target.closest('.cart-item').dataset.id;
                const change = e.target.classList.contains('plus') ? 1 : -1;
                this.updateQuantity(itemId, change);
            }
        });

        // Setup remove buttons using event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                const itemId = e.target.closest('.cart-item').dataset.id;
                this.removeItem(itemId);
            }
        });
    }

    removeItem(itemId) {
        // Find the item in the cart
        const index = this.items.findIndex(item => item.id === itemId);
        if (index !== -1) {
            // Remove the item from the array
            this.items.splice(index, 1);
            // Save the updated cart
            this.saveCart();
            // Update the UI
            this.updateCartUI();
            // Show a notification
            this.showNotification('Item removed from cart');
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Add styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            .cart-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #4CAF50;
                color: white;
                padding: 15px 25px;
                border-radius: 5px;
                z-index: 1000;
                animation: slideIn 0.5s ease-out, fadeOut 0.5s ease-out 2s forwards;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        // Remove notification after 2.5 seconds
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 2500);
    }

    loadCart() {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            const parsedCart = JSON.parse(cartData);
            this.items = parsedCart.items || [];
            this.total = parsedCart.total || 0;
            this.shipping = parsedCart.shipping || 0;
            this.updateCartUI();
        }
    }

    saveCart() {
        const cartData = {
            items: this.items,
            total: this.calculateTotal()
        };
        localStorage.setItem('cart', JSON.stringify(cartData));
        this.updateCartCount();
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.shipping = this.total >= 80000 ? 0 : 2000;
        return this.total;
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-icon span');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    updateCartUI() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const emptyCartMessage = document.querySelector('.empty-cart-message');
        const clearAllBtn = document.querySelector('.clear-all-btn');
        
        if (!cartItemsContainer) return;

        // Clear existing items except the header and empty cart message
        const cartHeader = cartItemsContainer.querySelector('.cart-header');
        cartItemsContainer.innerHTML = '';
        if (cartHeader) cartItemsContainer.appendChild(cartHeader);
        if (emptyCartMessage) cartItemsContainer.appendChild(emptyCartMessage);
        if (clearAllBtn) cartItemsContainer.appendChild(clearAllBtn);

        if (this.items.length === 0) {
            if (emptyCartMessage) emptyCartMessage.style.display = 'flex';
            if (clearAllBtn) clearAllBtn.style.display = 'none';
        } else {
            if (emptyCartMessage) emptyCartMessage.style.display = 'none';
            if (clearAllBtn) clearAllBtn.style.display = 'block';

            // Add items to cart
            this.items.forEach(item => {
                const cartItemHTML = `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="product-info">
                            <img src="${item.image}" alt="${item.name}" />
                            <div class="product-details">
                                <h4>${item.name}</h4>
                                <button class="remove-btn" data-id="${item.id}">Remove</button>
                            </div>
                        </div>
                        <div class="quantity-controls">
                            <button class="quantity-btn minus">−</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <div class="price">₦${item.price.toLocaleString()}</div>
                        <div class="subtotal">₦${(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                `;
                cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
            });
        }

        // Update summary
        const total = this.calculateTotal();
        const subtotalElement = document.querySelector('.subtotal-row span:last-child');
        const shippingElement = document.querySelector('.shipping-row span:nth-child(2)');
        const totalElement = document.querySelector('.total-row span:last-child');

        if (subtotalElement) subtotalElement.textContent = `₦${total.toLocaleString()}`;
        if (shippingElement) shippingElement.textContent = `₦${this.shipping.toLocaleString()}`;
        if (totalElement) totalElement.textContent = `₦${(total + this.shipping).toLocaleString()}`;

        // Update progress bar
        const progressBar = document.querySelector('.progress-bar .progress');
        if (progressBar) {
            const percentage = Math.min((total / 80000) * 100, 100);
            progressBar.style.width = `${percentage}%`;
        }
    }

    updateProgressBar() {
        const progressBar = document.querySelector('.progress');
        const progressText = document.querySelector('.progress-bar p');
        const targetAmount = 80000;

        if (!progressBar || !progressText) return;

        if (this.total >= targetAmount) {
            progressBar.style.width = '100%';
            progressText.textContent = 'You have FREE shipping!';
        } else {
            const percentage = (this.total / targetAmount) * 100;
            progressBar.style.width = `${percentage}%`;
            const remaining = targetAmount - this.total;
            progressText.textContent = `Add ₦${remaining.toLocaleString()} more for FREE shipping`;
        }
    }

    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (!item) return;

        const newQuantity = item.quantity + change;
        
        if (newQuantity < 1) {
            this.removeItem(productId);
        } else {
            item.quantity = newQuantity;
            this.updateCartUI();
        }
    }    removeItem(productId) {
        const itemElement = document.querySelector(`.cart-item[data-id="${productId}"]`);
        if (!itemElement) return;

        // Find the item in the cart
        const item = this.items.find(item => item.id === productId);
        if (!item) return;

        // Add removing class for animation
        itemElement.classList.add('removing');

        // Remove the item after animation
        setTimeout(() => {
            // Remove from data
            this.items = this.items.filter(item => item.id !== productId);
            
            // Update storage and UI
            this.saveCart();
            this.updateCartUI();
            
            // Show feedback toast
            this.showToast(`${item.name} removed from cart`);

            // Check if cart is empty and show appropriate message
            if (this.items.length === 0) {
                const emptyMessage = document.querySelector('.empty-cart-message');
                if (emptyMessage) emptyMessage.style.display = 'flex';
            }
        }, 500);
    }

    showToast(message) {
        // Create toast element if it doesn't exist
        let toast = document.querySelector('.cart-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'cart-toast';
            document.body.appendChild(toast);
        }

        // Set message and show toast
        toast.textContent = message;
        toast.classList.add('show');

        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    clearCart() {
        if (confirm('Are you sure you want to clear all items from your cart?')) {
            this.items = [];
            this.saveCart();
            this.updateCartUI();
            this.showNotification('Cart cleared successfully');
        }
    }

    updateCartCounter() {
        const cartCounter = document.querySelector('.cart-icon span');
        if (cartCounter) {
            const totalQuantity = this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
            
            // Add animation class
            cartCounter.classList.add('cart-counter-animate');
            cartCounter.textContent = totalQuantity.toString();
            
            // Remove animation class after animation completes
            setTimeout(() => {
                cartCounter.classList.remove('cart-counter-animate');
            }, 300);
        }
    }

    setupPaystackCheckout() {
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.initializePayment());
        }
    }

    isUserLoggedIn() {
        return localStorage.getItem('userLoggedIn') === 'true';
    }

    initializePayment() {
        if (this.total <= 0) {
            alert('Your cart is empty!');
            return;
        }

        // Check if user is logged in
        if (!this.isUserLoggedIn()) {
            const response = confirm('Please log in or sign up to continue with checkout. Click OK to log in, or Cancel to sign up.');
            if (response) {
                window.location.href = 'login.html';
            } else {
                window.location.href = 'signup.html';
            }
            return;
        }

        let handler = PaystackPop.setup({
            key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with your Paystack public key
            email: prompt('Please enter your email address:'),
            amount: this.total * 100, // Paystack amount is in kobo
            currency: 'NGN',
            ref: 'GONE_' + Math.floor(Math.random() * 1000000000 + 1),
            metadata: {
                custom_fields: [
                    {
                        display_name: "Destination Account",
                        variable_name: "destination_account",
                        value: "9162919586"
                    },
                    {
                        display_name: "Destination Bank",
                        variable_name: "destination_bank",
                        value: "Opay"
                    }
                ]
            },
            callback: (response) => {
                // Handle successful payment
                alert('Payment successful! Reference: ' + response.reference);
                // Clear cart after successful payment
                this.items = [];
                this.total = 0;
                this.shipping = 0;
                this.saveCart();
                this.updateCartUI();
            },
            onClose: () => {
                // Handle payment window close
                alert('Transaction cancelled');
            }
        });
        handler.openIframe();
    }

    handlePaymentProof() {
        const fileInput = document.getElementById('payment-proof');
        const submitBtn = document.querySelector('.submit-transfer-btn');
        
        if (!fileInput || !submitBtn) return;

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please upload an image file');
                    fileInput.value = '';
                    return;
                }
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size should not exceed 5MB');
                    fileInput.value = '';
                    return;
                }
            }
        });

        submitBtn.addEventListener('click', async () => {
            if (!fileInput.files.length) {
                alert('Please select a proof of payment file first');
                return;
            }

            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('paymentProof', file);
            formData.append('amount', this.total + this.shipping);
            formData.append('orderId', 'ORDER-' + Date.now());

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Uploading...';

                // Here you would typically send the formData to your server
                // For now, we'll simulate a server response
                await new Promise(resolve => setTimeout(resolve, 2000));

                alert('Thank you! Your payment proof has been submitted and will be verified shortly.');
                this.clearCart();
                fileInput.value = '';
            } catch (error) {
                alert('Failed to upload payment proof. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Transfer Proof';
            }
        });
    }

    blinkCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('blink');
            setTimeout(() => {
                cartIcon.classList.remove('blink');
            }, 2800); // 0.7s * 4 cycles
        }
    }

    addProductToCart(productDetails) {
        const existingItem = this.items.find(item => item.id === productDetails.id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            this.items.push({
                ...productDetails,
                quantity: 1
            });
        }
        this.updateCartUI();
        this.blinkCartIcon();
    }

    static initialize() {
        // Create singleton instance
        if (!window.cartInstance) {
            window.cartInstance = new Cart();
        }
        return window.cartInstance;
    }
}

// Initialize cart and expose methods globally
const cart = Cart.initialize();

// Make functions available globally
window.addToCart = (productDetails) => cart.addProductToCart(productDetails);
window.removeFromCart = (productId) => cart.removeItem(productId);