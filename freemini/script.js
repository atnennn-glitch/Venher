(function () {
  var SITE_URL = "https://venher-systemni-prodazhi.atnennn.chatgpt.site";
  var THANKS_URL = "https://venher-edu.space/freemin/thanks";
  var deadlineKey = "venher_access_deadline";
  var deadline = Number(localStorage.getItem(deadlineKey));

  if (!deadline || deadline <= Date.now()) {
    deadline = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(deadlineKey, String(deadline));
  }

  function updateTimer() {
    var remaining = Math.max(0, deadline - Date.now());
    var values = [
      Math.floor(remaining / 86400000),
      Math.floor((remaining % 86400000) / 3600000),
      Math.floor((remaining % 3600000) / 60000),
      Math.floor((remaining % 60000) / 1000),
    ];
    document.querySelectorAll(".timer-display strong").forEach(function (node, index) {
      node.textContent = String(values[index] || 0).padStart(2, "0");
    });
  }

  updateTimer();
  setInterval(updateTimer, 1000);

  document.querySelectorAll(".problem-row, .outcome-track > button").forEach(function (button) {
    button.addEventListener("click", function () {
      var parent = button.parentElement;
      parent.querySelectorAll("button").forEach(function (item) {
        if (item !== button) {
          item.classList.remove("is-active");
          item.setAttribute("aria-pressed", "false");
        }
      });
      var next = !button.classList.contains("is-active");
      button.classList.toggle("is-active", next);
      button.setAttribute("aria-pressed", String(next));
    });
  });

  var form = document.querySelector(".email-form");
  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var button = form.querySelector('button[type="submit"]');
      if (!input || !input.checkValidity()) {
        if (input) input.reportValidity();
        return;
      }
      if (button) {
        button.disabled = true;
        button.textContent = "Зберігаємо…";
      }
      try {
        await fetch(SITE_URL + "/api/leads", {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          body: JSON.stringify({ email: input.value.trim() }),
        });
        window.location.href = THANKS_URL;
      } catch (error) {
        window.location.href = SITE_URL + "/#access";
      }
    });
  }

  var pixel = document.createElement("script");
  pixel.async = true;
  pixel.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(pixel);
  window.fbq = window.fbq || function () { (window.fbq.queue = window.fbq.queue || []).push(arguments); };
  window.fbq("init", "1280398327139709");
  window.fbq("track", "PageView");
})();
