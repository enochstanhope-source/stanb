// No animation or delay, content loads instantly

// ourstory.js - Animation and page load logic
document.addEventListener('DOMContentLoaded', function() {
	var storyMain = document.querySelector('.story-main');
	if (storyMain) {
		setTimeout(function() {
			storyMain.classList.add('animated');
		}, 100); // slight delay for effect
	}
});
