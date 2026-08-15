(function () {
  var pixel = document.createElement("script");
  pixel.async = true;
  pixel.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(pixel);

  window.fbq = window.fbq || function () {
    (window.fbq.queue = window.fbq.queue || []).push(arguments);
  };
  window.fbq("init", "1280398327139709");
  window.fbq("track", "PageView");
  window.fbq("track", "Lead");
})();
