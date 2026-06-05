const modal = document.querySelector('#form-modal');
const toast = document.querySelector('.toast');

document.querySelectorAll('.js-open-form').forEach((button) => {
  button.addEventListener('click', () => modal.showModal());
});

document.querySelector('.modal__close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});

document.querySelectorAll('.js-form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    form.reset();
    if (modal.open) modal.close();
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 3500);
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
