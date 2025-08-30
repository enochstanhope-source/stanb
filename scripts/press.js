// press.js - Animation and page load logic
document.addEventListener('DOMContentLoaded', function() {
  var pressMain = document.querySelector('.press-main');
  if (pressMain) {
    setTimeout(function() {
      pressMain.classList.add('animated');
    }, 100); // slight delay for effect
  }
});
