const floatingAccess = document.querySelector(".floating-access");
const audience = document.querySelector("#for-whom");
const offer = document.querySelector("#buy");

function updateFloatingAccess() {
  const passedAudience = audience.getBoundingClientRect().bottom <= 0;
  const offerBounds = offer.getBoundingClientRect();
  const offerVisible = offerBounds.top < window.innerHeight && offerBounds.bottom > 0;
  floatingAccess.hidden = !passedAudience || offerVisible;
}
window.addEventListener("scroll", updateFloatingAccess, { passive: true });
window.addEventListener("resize", updateFloatingAccess);
updateFloatingAccess();
