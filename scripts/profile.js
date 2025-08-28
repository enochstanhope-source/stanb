// Profile Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    const profileModal = document.getElementById('profileModal');
    const closeModalBtn = profileModal.querySelector('.close-modal');
    const cancelBtn = profileModal.querySelector('.cancel-btn');
    const saveBtn = profileModal.querySelector('.save-btn');
    const editProfileBtn = profileModal.querySelector('.edit-profile');
    const createStoreBtn = profileModal.querySelector('.create-store-btn');

    // Event: Handle create store button
    if (createStoreBtn) {
        createStoreBtn.addEventListener('click', () => {
            showMessage('Feature coming soon!', 'info');
        });
    }

    // Function to show modal
    function showProfileModal() {
        // First check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            window.location.href = 'login.html';
            return;
        }

        profileModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Load all user data from localStorage
        const userData = {
            firstName: localStorage.getItem('userFirstName'),
            lastName: localStorage.getItem('userLastName'),
            email: localStorage.getItem('userEmail'),
            phone: localStorage.getItem('userPhone')
        };

        // Update form fields with user data
        const firstNameInput = document.getElementById('profileFirstName');
        const lastNameInput = document.getElementById('profileLastName');
        const emailInput = document.getElementById('profileEmail');
        const phoneInput = document.getElementById('profilePhone');

        if (firstNameInput) firstNameInput.value = userData.firstName || '';
        if (lastNameInput) lastNameInput.value = userData.lastName || '';
        if (emailInput) emailInput.value = userData.email || '';
        if (phoneInput) phoneInput.value = userData.phone || '';

        console.log('Loaded user data:', userData); // Debug log to check values

        // Set all fields to readonly initially
        const fields = profileModal.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
        fields.forEach(field => {
            field.readOnly = true;
        });

        // Add click handlers for email and phone fields
        const phoneField = document.getElementById('profilePhone');
        const emailField = document.getElementById('profileEmail');
        
        if (phoneField) phoneField.addEventListener('click', showSupportMessage);
        if (emailField) emailField.addEventListener('click', showSupportMessage);
    }

    // Function to show support message
    function showSupportMessage() {
        showMessage('Please contact support to update your email or phone number.', 'info');
    }

    // Function to show messages
    function showMessage(message, type = 'info') {
        // Remove existing message
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            max-width: 300px;
            word-wrap: break-word;
            ${type === 'success' ? 'background-color: #4CAF50;' : ''}
            ${type === 'error' ? 'background-color: #f44336;' : ''}
            ${type === 'info' ? 'background-color: #2196F3;' : ''}
        `;
        
        document.body.appendChild(messageDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Function to hide modal
    function hideProfileModal() {
        profileModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Event: Open modal when profile link is clicked
    document.addEventListener('click', (e) => {
        if (e.target.closest('#myProfileLink')) {
            e.preventDefault();
            showProfileModal();
        }
    });

    // Event: Close modal when clicking close button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideProfileModal);
    }

    // Event: Close modal when clicking cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideProfileModal);
    }

    // Event: Save changes when clicking save button
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // Get updated values for name fields only
            const firstName = document.getElementById('profileFirstName').value;
            const lastName = document.getElementById('profileLastName').value;

            // Update localStorage
            localStorage.setItem('userFirstName', firstName);
            localStorage.setItem('userLastName', lastName);
            
            showMessage('Profile updated successfully!', 'success');
            hideProfileModal();
        });
    }

    // Event: Close modal when clicking outside
    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            hideProfileModal();
        }
    });

    // Event: Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && profileModal.style.display === 'flex') {
            hideProfileModal();
        }
    });

    // Event: Handle edit profile button
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            // Make only name fields editable
            document.getElementById('profileFirstName').readOnly = false;
            document.getElementById('profileLastName').readOnly = false;
            
            // Show message about limited editing
            showMessage('Only name fields can be edited. Please contact support to update email or phone number.', 'info');
        });
    }
});
