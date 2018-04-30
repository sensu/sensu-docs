const $cookieLife = 1825;

// I've heard that .stopPropogation() is not ideal, potentially needs a rework
$( document ).ready(function() {
    // set toggles for top of page dropdown
    $('.platformButtonTitle').click( function(event){
        event.stopPropagation();
        $('.hiddenPlatforms').toggle();
    });
    $(document).click( function(){
        $('.hiddenPlatforms').hide();
    });

    if (document.getElementById("platformButtonTitleText")) {
      setTopDropdown();
    }
});

function setTopDropdown() {
  var $platformTextInsert = document.getElementById("platformButtonTitleText");
  if (Cookies.get("platform")) {
    $platformTextInsert.innerHTML = Cookies.get("platform");
  } else {
    // If we don't have a cookie for the platform
    $platformTextInsert.innerHTML = 'All Platforms';
  }
}

function setHeaderDropdowns($uniqueness) {
  // set toggles for under header dropdowns
  $('.platformButtonTitle-' + $uniqueness).click( function(event){
    event.stopPropagation();
    $('.hiddenPlatforms-' + $uniqueness).toggle();
  });
  $(document).click( function(){
    $('.hiddenPlatforms-' + $uniqueness).hide();
  });

  var $platformTextInsert = document.getElementById("platformButtonTitleText-" + $uniqueness);
  if (Cookies.get("platform")) {
    $platformTextInsert.innerHTML = Cookies.get("platform") + '<i class="fa fa-chevron-down dropdownArrow-' + $uniqueness + '" aria-hidden="true"></i>';
  }
}

function setPlatformCookie($platform) {
  Cookies.set('platform', $platform, { expires: $cookieLife });
  togglePlatformDivs();
  setTopDropdown();
}

function removePlatformCookie() {
  Cookies.remove('platform');
  togglePlatformDivs();
  setTopDropdown();
}
