$(document).ready(function() {
  // Set default values
  if (Cookies.get('platform')) {
    $('.platform-picker--value').text(Cookies.get('platform'));
  }

  $('.platform-picker').click(function(e) {
    e.stopPropagation();
    $(this).toggleClass('open');
  });

  $('.platform-picker a').click(function(e) {
    e.preventDefault();
    Cookies.set('platform', e.currentTarget.dataset.platform, { expires: 1825 });
    togglePlatformDivs();
  });

  $(document).click(function() {
    $('.platform-picker').removeClass('open');
  });

  togglePlatformDivs();
});

function removePlatformCookie() {
  Cookies.remove('platform');
  togglePlatformDivs();
}

function togglePlatformDivs() {
  var platformCookie = Cookies.get('platform');
  var $platformDivs = document.getElementsByClassName('platform');
  var hasContentForPlatformCookie = false;

  Array.prototype.forEach.call($platformDivs, function($platformDiv) {
    if (typeof platformCookie != 'undefined' && !$platformDiv.dataset.platform.includes(platformCookie)) {
      $platformDiv.style.display = 'none';
    } else {
      $platformDiv.style.display = 'block';
      hasContentForPlatformCookie = true
    }
  });

  // If we don't have any content for the platform cookie, remove it so we go
  // back to the "All Platforms" option and display everything
  if (typeof platformCookie != 'undefined' && !hasContentForPlatformCookie) {
    removePlatformCookie();
  }
}
