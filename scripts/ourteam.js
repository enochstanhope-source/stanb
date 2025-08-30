// ourteam.js - Animation and page load logic
document.addEventListener('DOMContentLoaded', function() {
  var teamMain = document.querySelector('.team-main');
  if (teamMain) {
    setTimeout(function() {
      teamMain.classList.add('animated');
    }, 100); // slight delay for effect
  }
});
