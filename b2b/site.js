const hero = document.querySelector(".hero");
const footer = document.querySelector(".footer");
const floatingCta = document.querySelector(".floating-cta");
const cards = [...document.querySelectorAll(".price-card")];

if ("IntersectionObserver" in window) {
  const obstructsCta = (element) => {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };
  const updateFloatingCta = () => {
    const heroPassed = hero.getBoundingClientRect().bottom <= 0;
    floatingCta.hidden = !heroPassed || [...cards, footer].some(obstructsCta);
  };
  const observer = new IntersectionObserver(updateFloatingCta);
  [hero, ...cards, footer].forEach((element) => observer.observe(element));
  updateFloatingCta();
}
