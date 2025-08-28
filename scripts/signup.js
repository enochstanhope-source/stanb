// Grandpa Project Signup - Replicating CelebMingle Firebase Auth
// Firebase scripts must be loaded in HTML before this script

document.addEventListener('DOMContentLoaded', function() {
    function waitForFirebase() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 30;
            const check = () => {
                if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error('Firebase failed to load'));
                } else {
                    attempts++;
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    waitForFirebase().then(() => {
        const auth = firebase.auth();
        const db = firebase.firestore();
        const signupForm = document.getElementById('signupForm');
        if (!signupForm) return;
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = document.querySelector('.signup-btn');
            if (submitBtn) {
                submitBtn.textContent = 'Creating Account...';
                submitBtn.disabled = true;
            }
            // Get values
            const name = signupForm.name.value.trim();
            const phone = signupForm.phone.value.trim();
            const dob = signupForm.dob.value;
            const email = signupForm.email.value.trim();
            const confirmEmail = signupForm.confirmEmail.value.trim();
            const address = signupForm.address.value.trim();
            const password = signupForm.password.value;
            const confirmPassword = signupForm.confirmPassword.value;
            const terms = signupForm.terms.checked;

            // Validation
            if (!name || !phone || !dob || !email || !confirmEmail || !address || !password || !confirmPassword) {
                showError('Please fill in all fields.');
                return;
            }
            if (!/^\d{10,15}$/.test(phone)) {
                showError('Please enter a valid phone number (10-15 digits).');
                return;
            }
            if (email !== confirmEmail) {
                showError('Email addresses do not match.');
                return;
            }
            if (password.length < 6) {
                showError('Password must be at least 6 characters.');
                return;
            }
            if (password !== confirmPassword) {
                showError('Passwords do not match.');
                return;
            }
            if (!terms) {
                showError('You must agree to the Terms & Conditions.');
                return;
            }

            // Show loading overlay
            const overlay = document.querySelector('.register-overlay');
            if (overlay) overlay.style.display = 'flex';

            // Check if email is already used in Firebase
            firebase.auth().fetchSignInMethodsForEmail(email)
                .then((methods) => {
                    if (methods && methods.length > 0) {
                        if (overlay) overlay.style.display = 'none';
                        showError('This email is already registered. Please use another email.');
                        return Promise.reject('Email already in use');
                    }
                    // Proceed with registration
                    return firebase.auth().createUserWithEmailAndPassword(email, password);
                })
                .then((userCredential) => {
                    // Save extra info to Firestore
                    return firebase.firestore().collection('users').doc(userCredential.user.uid).set({
                        name,
                        phone,
                        dob,
                        address,
                        email,
                        createdAt: new Date().toISOString()
                    });
                })
                .then(() => {
                    // Set login mode and user info in localStorage for consistency
                    const userInfo = {
                        name,
                        email,
                        phone,
                        dob,
                        address,
                        initials: name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : (email[0] || '').toUpperCase(),
                        lastLogin: new Date().toISOString()
                    };
                    const authState = {
                        isLoggedIn: true,
                        lastLogin: new Date().toISOString(),
                        userInfo
                    };
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                    localStorage.setItem('authState', JSON.stringify(authState));
                    sessionStorage.setItem('isLoggedIn', 'true');
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    if (error !== 'Email already in use') {
                        if (overlay) overlay.style.display = 'none';
                        showError(error.message || 'Registration failed.');
                    }
                });
        });
        function showError(msg) {
            let errorContainer = document.getElementById('errorContainer');
            if (!errorContainer) {
                errorContainer = document.createElement('div');
                errorContainer.id = 'errorContainer';
                errorContainer.style.color = 'red';
                errorContainer.style.margin = '10px 0';
                signupForm.parentNode.insertBefore(errorContainer, signupForm);
            }
            errorContainer.textContent = msg;
            errorContainer.style.display = 'block';
            setTimeout(() => {
                errorContainer.style.display = 'none';
            }, 5000);
        }
    }).catch(() => {
        alert('Failed to load authentication service. Please refresh the page.');
    });
});
// ...existing code removed after new logic...
        const firstName = form.querySelector('#firstName').value.trim();
        const lastName = form.querySelector('#lastName').value.trim();
        const email = form.querySelector('#email').value.trim();
        const phoneNumber = form.querySelector('#phoneNumber').value.trim();
        const password = form.querySelector('#password').value;

        // Additional validation
        if (!firstName || !lastName || !email || !phoneNumber || !password) {
            throw new Error('Please fill in all fields');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        if (phoneNumber.length !== 11) {
            throw new Error('Phone number must be 11 digits');
        }

        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile
        await updateProfile(user, {
            displayName: `${firstName} ${lastName}`,
            phoneNumber: phoneNumber
        });

        // Store user info
        localStorage.setItem('userFirstName', firstName);
        localStorage.setItem('userLastName', lastName);
// ...existing code removed after new logic...