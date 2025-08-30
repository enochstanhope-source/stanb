// --- Hero Section: Continuous Right-to-Left Slider ---
function startHeroSlider() {
	const slider = document.querySelector('.slider-container');
	if (!slider) return;
	const slides = slider.querySelectorAll('.slide');
	if (!slides.length) return;
	let current = 0;
	slides.forEach((slide, i) => {
		slide.style.position = 'absolute';
		slide.style.left = 0;
		slide.style.top = 0;
		slide.style.width = '100%';
		slide.style.height = '100%';
		slide.style.transition = 'transform 0.8s cubic-bezier(0.77,0,0.175,1), opacity 0.8s';
		slide.style.transform = i === 0 ? 'translateX(0)' : 'translateX(100%)';
		slide.style.opacity = i === 0 ? '1' : '0';
		slide.style.zIndex = i === 0 ? '2' : '1';
	});
	setInterval(() => {
		const prev = current;
		current = (current + 1) % slides.length;
		slides[prev].style.transform = 'translateX(-100%)';
		slides[prev].style.opacity = '0';
		slides[prev].style.zIndex = '1';
		slides[current].style.transform = 'translateX(0)';
		slides[current].style.opacity = '1';
		slides[current].style.zIndex = '2';
		// Reset previous slide to right after animation
		setTimeout(() => {
			if (prev !== current) {
				slides[prev].style.transition = 'none';
				slides[prev].style.transform = 'translateX(100%)';
				setTimeout(() => {
					slides[prev].style.transition = 'transform 0.8s cubic-bezier(0.77,0,0.175,1), opacity 0.8s';
				}, 10);
			}
		}, 800);
	}, 1800);
}
// --- Slider Autoplay for Mobile ---
function initMobileSliderAutoplay() {
	if (window.innerWidth > 768) return;
	const slides = document.querySelectorAll('.slider-container .slide');
	if (!slides.length) return;
	let current = 0;
	slides.forEach((slide, i) => {
		slide.style.transition = 'transform 0.7s cubic-bezier(0.77,0,0.175,1)';
		slide.style.position = 'absolute';
		slide.style.left = 0;
		slide.style.top = 0;
		slide.style.width = '100%';
		slide.style.height = '100%';
		slide.style.transform = i === 0 ? 'translateX(0)' : 'translateX(100%)';
		slide.style.opacity = i === 0 ? '1' : '0';
		slide.style.zIndex = i === 0 ? '2' : '1';
	});
	setInterval(() => {
		const prev = current;
		current = (current + 1) % slides.length;
		slides[prev].style.transform = 'translateX(-100%)';
		slides[prev].style.opacity = '0';
		slides[prev].style.zIndex = '1';
		slides[current].style.transform = 'translateX(0)';
		slides[current].style.opacity = '1';
		slides[current].style.zIndex = '2';
		// Reset previous slide to right after animation
		setTimeout(() => {
			if (prev !== current) {
				slides[prev].style.transition = 'none';
				slides[prev].style.transform = 'translateX(100%)';
				setTimeout(() => {
					slides[prev].style.transition = 'transform 0.7s cubic-bezier(0.77,0,0.175,1)';
				}, 10);
			}
		}, 700);
	}, 1000);
}

// Loader logic
window.addEventListener('DOMContentLoaded', function() {
	setTimeout(function() {
		var loader = document.getElementById('loader-overlay');
		if (loader) {
			loader.style.opacity = '0';
			setTimeout(function() {
				loader.style.display = 'none';
			}, 300);
		}
	}, 3000);
});

// Hamburger menu logic
function createHamburger() {
	// Prevent duplicate hamburger
	if (document.getElementById('hamburger-menu-btn')) return;
	const nav = document.querySelector('nav');
	if (!nav) return;
	const hamburger = document.createElement('button');
	hamburger.id = 'hamburger-menu-btn';
	hamburger.setAttribute('aria-label', 'Open menu');
	hamburger.innerHTML = '<span></span><span></span><span></span>';
	// Store original hamburger HTML for toggling
	const hamburgerHTML = hamburger.innerHTML;
	nav.appendChild(hamburger);
	let navActionsOriginalParent = null;
	let navActionsLi = null;
		let mobileAccountLi = null;
		let mobileContactLi = null;
			function injectDesktopNavActions() {
				// Desktop mode: do not inject any links
				return;
			}

			function removeDesktopNavActions() {
				const stack = document.getElementById('desktop-nav-links-stack');
				if (stack && stack.parentNode) stack.parentNode.removeChild(stack);
			}

			hamburger.addEventListener('click', function() {
				const navLinks = document.querySelector('.nav-links');
				if (window.innerWidth <= 768) {
					if (!document.body.classList.contains('mobile-menu-open') && !document.body.classList.contains('mobile-menu-closing')) {
						// Change hamburger to cancel button
						hamburger.classList.add('cancel-x-btn');
						hamburger.setAttribute('aria-label', 'Cancel');
						hamburger.innerHTML = '&times;';
						// Open menu
						document.body.classList.add('mobile-menu-open');
						navLinks.style.display = 'flex';
						// Inject all navigation links for mobile mode
						// Clear navLinks first
						navLinks.innerHTML = '';

						// About Us
						const aboutLi = document.createElement('li');
						aboutLi.className = 'nav-dropdown';
						aboutLi.innerHTML = `
							<a href="#about">About Us <i class="fas fa-chevron-down"></i></a>
							<ul class="dropdown-menu">
								<li><a href="about.html"><i class="fas fa-history"></i> Our Story</a></li>
								<li><a href="about.html#team"><i class="fas fa-users"></i> Our Team</a></li>
								<li><a href="about.html#careers"><i class="fas fa-briefcase"></i> Careers</a></li>
								<li><a href="about.html#press"><i class="fas fa-newspaper"></i> Press</a></li>
							</ul>
						`;

						// Courses
						const coursesLi = document.createElement('li');
						coursesLi.className = 'nav-dropdown';
						coursesLi.innerHTML = `
							<a href="#product">Courses <i class="fas fa-chevron-down"></i></a>
							<ul class="dropdown-menu">
								<li><a href="product.html"><i class="fas fa-certificate"></i> Certificate Programs</a></li>
								<li><a href="product.html#bestsellers"><i class="fas fa-graduation-cap"></i> Diploma Programs</a></li>
								<li><a href="product.html#sale"><i class="fas fa-clock"></i> Short Courses</a></li>
										<li><a href="product.html#collections"><i class="fas fa-tools"></i> Vocational Training</a></li>
										<li><a href="product.html#sale"><i class="fas fa-lightbulb"></i> Entrepreneurship</a></li>
									</ul>
								`;

								// Programs
								const programsLi = document.createElement('li');
								programsLi.className = 'nav-dropdown';
								programsLi.innerHTML = `
									<a href="#testimonial">Programs <i class="fas fa-chevron-down"></i></a>
									<ul class="dropdown-menu">
										<li><a href="testimonial.html"><i class="fas fa-briefcase"></i> Internship Programs</a></li>
										<li><a href="testimonial.html"><i class="fas fa-cogs"></i> Workings</a></li>
										<li><a href="testimonial.html"><i class="fas fa-chalkboard-teacher"></i> Mentorship</a></li>
										<li><a href="testimonial.html"><i class="fas fa-building"></i> Industry Partners</a></li>
									</ul>
								`;

								// Account
								if (!mobileAccountLi) {
									mobileAccountLi = document.createElement('li');
									mobileAccountLi.className = 'mobile-nav-account';
									mobileAccountLi.innerHTML = `
											<div class="account-dropdown">
												<div class="guest-account" id="guestAccount">
													<a href="#" class="account-link">
														<i class="fas fa-user-circle"></i>
														<span>Account</span>
														<i class="fas fa-chevron-down"></i>
													</a>
													<ul class="dropdown-menu" id="guestDropdown">
														<li>
															<a href="login.html"><i class="fas fa-sign-in-alt"></i> Login</a>
														</li>
														<li>
															<a href="signup.html"><i class="fas fa-user-plus"></i> Sign Up</a>
														</li>
													</ul>
												</div>
											</div>
									`;
								}

								// Contact Us
								if (!mobileContactLi) {
									mobileContactLi = document.createElement('li');
									mobileContactLi.className = 'mobile-nav-contact';
									mobileContactLi.innerHTML = `
											<div class="nav-dropdown">
												<button class="contact-btn">
													Contact Us <i class="fas fa-chevron-down"></i>
												</button>
												<ul class="dropdown-menu">
													<li>
														<a href="contact.html"><i class="fas fa-headset"></i> Customer Support</a>
													</li>
													<li>
														<a href="contact.html"><i class="fas fa-location-dot"></i> Store Locations</a>
													</li>
													<li>
														<a href="contact.html"><i class="fas fa-handshake"></i> Business Inquiries</a>
													</li>
													<li>
														<a href="contact.html"><i class="fas fa-message"></i> Contact Form</a>
													</li>
												</ul>
											</div>
									`;
								}

								// Append all links in order
								navLinks.appendChild(aboutLi);
								navLinks.appendChild(coursesLi);
								navLinks.appendChild(programsLi);
								navLinks.appendChild(mobileContactLi);
								navLinks.appendChild(mobileAccountLi);
					} else if (document.body.classList.contains('mobile-menu-open')) {
						// Start closing animation
						document.body.classList.remove('mobile-menu-open');
						document.body.classList.add('mobile-menu-closing');
						// Change cancel button back to hamburger
						hamburger.classList.remove('cancel-x-btn');
						hamburger.setAttribute('aria-label', 'Open menu');
						hamburger.innerHTML = hamburgerHTML;
						// Wait for animation to finish, then hide and cleanup
						navLinks.addEventListener('animationend', function handleNavSlideOut(e) {
							if (e.animationName === 'navSlideOut') {
								navLinks.style.display = 'none';
								document.body.classList.remove('mobile-menu-closing');
								// Remove injected mobile menu items
								if (mobileAccountLi && mobileAccountLi.parentNode) {
									mobileAccountLi.parentNode.removeChild(mobileAccountLi);
								}
								if (mobileContactLi && mobileContactLi.parentNode) {
									mobileContactLi.parentNode.removeChild(mobileContactLi);
								}
								navLinks.removeEventListener('animationend', handleNavSlideOut);
							}
						});
					}
				}
			});
	// Hide nav-links by default in mobile
	const navLinks = document.querySelector('.nav-links');
	if (window.innerWidth <= 768 && navLinks) {
		navLinks.style.display = 'none';
		navLinks.style.flexDirection = 'column';
		navLinks.style.alignItems = 'flex-start';
	}

	// Hide nav-actions by default in mobile
	const navActions = document.querySelector('.nav-actions');
	if (window.innerWidth <= 768 && navActions) {
		navActions.style.display = 'none';
		navActions.style.flexDirection = 'column';
		navActions.style.alignItems = 'flex-start';
	}
}

function removeHamburger() {
	const btn = document.getElementById('hamburger-menu-btn');
	if (btn) btn.remove();
	document.body.classList.remove('mobile-menu-open');
	// Restore nav-links display
	const navLinks = document.querySelector('.nav-links');
	if (navLinks) {
		navLinks.style.display = '';
		navLinks.style.flexDirection = '';
		navLinks.style.alignItems = '';
	}

	// Restore nav-actions display
	const navActions = document.querySelector('.nav-actions');
	if (navActions) {
		navActions.style.display = '';
		navActions.style.flexDirection = '';
		navActions.style.alignItems = '';
	}
}

function handleHamburgerDisplay() {
	if (window.innerWidth <= 768) {
		createHamburger();
		// Hide nav-links by default in mobile
		const navLinks = document.querySelector('.nav-links');
		if (navLinks && !document.body.classList.contains('mobile-menu-open')) {
			navLinks.style.display = 'none';
			navLinks.style.flexDirection = 'column';
			navLinks.style.alignItems = 'flex-start';
		}

		// Hide nav-actions by default in mobile
		const navActions = document.querySelector('.nav-actions');
		if (navActions && !document.body.classList.contains('mobile-menu-open')) {
			navActions.style.display = 'none';
			navActions.style.flexDirection = 'column';
			navActions.style.alignItems = 'flex-start';
		}
	} else {
		removeHamburger();
		// Always clear nav-links in desktop mode
		const navLinks = document.querySelector('.nav-links');
		if (navLinks) {
			navLinks.innerHTML = '';
		}
	}
}

window.addEventListener('DOMContentLoaded', function() {
	handleHamburgerDisplay();
	if (window.innerWidth > 768) {
		injectDesktopNavActions();
	} else {
		removeDesktopNavActions();
	}
	  startHeroSlider();
});
window.addEventListener('resize', handleHamburgerDisplay);
