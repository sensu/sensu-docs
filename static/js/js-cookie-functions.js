function setPlatformCookie(platform) {
  Cookies.set('platform', platform, { expires: 2030 });
  if (platform === "general") {
    window.location.href = "getting-started";
  } else {
    window.location.href = platform + "/getting-started";
  }
}
