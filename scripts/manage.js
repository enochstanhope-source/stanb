document.addEventListener('DOMContentLoaded', function() {
    // Profile image upload functionality
    const uploadButton = document.querySelector('.btn-upload');
    const deleteButton = document.querySelector('.btn-delete');
    const profileImage = document.querySelector('.profile-image img');
    const cameraIcon = document.querySelector('.camera-icon');
    
    // Create a hidden file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // Upload button click event
    uploadButton.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Camera icon click event
    cameraIcon.addEventListener('click', function() {
        fileInput.click();
    });
    
    // File input change event
    fileInput.addEventListener('change', function(event) {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                profileImage.src = e.target.result;
            };
            
            reader.readAsDataURL(event.target.files[0]);
        }
    });
      // Delete avatar button click event
    deleteButton.addEventListener('click', function() {
        // Store current image source to use if user cancels
        const currentImage = profileImage.src;
        
        // Show confirmation dialog
        const isConfirmed = confirm('Are you sure you want to delete your avatar?');
        
        if (isConfirmed) {
            // If confirmed, use nop.jpg as the profile picture
            profileImage.src = './images/nop.jpg';
        } else {
            // If canceled, retain the old picture
            profileImage.src = currentImage;
        }
    });
    
    // Settings sidebar navigation
    const settingsSidebarItems = document.querySelectorAll('.settings-sidebar li');
    
    settingsSidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            settingsSidebarItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Here you can add code to show different setting sections
            const settingName = this.querySelector('span').textContent;
            console.log(`Switched to ${settingName} settings`);
            
            // For now, just show an alert
            if (settingName !== 'Profile Settings') {
                alert(`${settingName} settings coming soon!`);
            }
        });
    });
    
    // Form validation for the save button
    const saveButton = document.querySelector('.btn-save');
    const firstNameInput = document.querySelector('.form-group:nth-child(1) input');
    const lastNameInput = document.querySelector('.form-group:nth-child(2) input');
    const emailInput = document.querySelector('.form-group:nth-child(3) input');
    const phoneInput = document.querySelector('.phone-input input');
    
    saveButton.addEventListener('click', function() {
        let valid = true;
        
        // Simple validation
        if (!firstNameInput.value.trim()) {
            firstNameInput.style.borderColor = 'red';
            valid = false;
        } else {
            firstNameInput.style.borderColor = '#e2e8f0';
        }
        
        if (!lastNameInput.value.trim()) {
            lastNameInput.style.borderColor = 'red';
            valid = false;
        } else {
            lastNameInput.style.borderColor = '#e2e8f0';
        }
        
        if (emailInput.value.trim() && !isValidEmail(emailInput.value)) {
            emailInput.style.borderColor = 'red';
            valid = false;
        } else {
            emailInput.style.borderColor = '#e2e8f0';
        }
        
        if (!phoneInput.value.trim()) {
            phoneInput.parentElement.style.borderColor = 'red';
            valid = false;
        } else {
            phoneInput.parentElement.style.borderColor = '#e2e8f0';
        }
        
        if (valid) {
            alert('Profile settings saved successfully!');
        } else {
            alert('Please fill in all required fields correctly.');
        }
    });
    
    // Function to show custom notification
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after animation completes
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Edit profile button functionality
    const editProfileButton = document.querySelector('.btn-save');
    if (editProfileButton) {
        editProfileButton.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Please contact support to edit your profile');
        });
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});
