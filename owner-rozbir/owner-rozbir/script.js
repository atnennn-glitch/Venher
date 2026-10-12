const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

document.querySelectorAll('details').forEach((detail) => detail.addEventListener('toggle', () => {
  if (detail.open) document.querySelectorAll('details[open]').forEach((other) => {
    if (other !== detail) other.removeAttribute('open');
  });
}));

const caseTrack = document.querySelector('[data-case-track]');
const caseStep = () => {
  const card = caseTrack?.querySelector('.case-card');
  return card ? card.getBoundingClientRect().width + 20 : Math.min(536, window.innerWidth - 28);
};
document.querySelector('[data-case-prev]')?.addEventListener('click', () => caseTrack.scrollBy({ left: -caseStep(), behavior: 'smooth' }));
document.querySelector('[data-case-next]')?.addEventListener('click', () => caseTrack.scrollBy({ left: caseStep(), behavior: 'smooth' }));

const floating = document.querySelector('.floating');
const problem = document.querySelector('#problem');
const updateFloating = () => {
  const showAfter = problem.offsetTop + Math.min(problem.offsetHeight * 0.45, 420);
  floating.classList.toggle('is-visible', window.scrollY > showAfter);
};
window.addEventListener('scroll', updateFloating, { passive: true });
updateFloating();

const modal = document.querySelector('#signup-modal');
const modalPanel = modal.querySelector('.modal-panel');
const firstField = modal.querySelector('input');
let lastFocused;

const openModal = () => {
  lastFocused = document.activeElement;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-lock');
  setTimeout(() => firstField.focus(), 30);
};

const closeModal = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-lock');
  lastFocused?.focus();
};

document.querySelectorAll('[data-modal-open]').forEach((button) => button.addEventListener('click', openModal));
document.querySelectorAll('[data-modal-close]').forEach((button) => button.addEventListener('click', closeModal));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

modalPanel.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const focusable = [...modalPanel.querySelectorAll('button, input, a[href]')].filter((el) => !el.disabled);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

document.querySelector('#signup-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const status = form.querySelector('.form-status');
  status.textContent = 'Відкриваємо Telegram…';
  if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
  window.setTimeout(() => {
    window.location.href = 'https://t.me/m/XaTMjRRKMDQ6';
  }, 220);
});
