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
