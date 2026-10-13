const modal = document.getElementById('registration-modal');
const modalForm = document.getElementById('modal-form');
const registerForm = document.getElementById('register-form');
const floatingCta = document.getElementById('floating-cta');
const prospects = document.getElementById('prospects');
const registerSection = document.getElementById('register');
const botUrl = 'https://telegram.me/Olga_Venher_bot?start=ZGw6MzQxMTYy';
const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbzwJc3WujQnZAM9zXamnYjozZ5lHlhQaupKaO-nHe15yuuTktKUOCtb_t37iDKxi-Fb1A/exec';

function showError(element, message) {
  element.textContent = message;
  element.hidden = !message;
}

function openModal() {
  showError(document.getElementById('modal-error'), '');
  modal.showModal();
  document.getElementById('modal-email').focus();
  updateFloatingCta();
}

document.querySelectorAll('.js-open-modal').forEach(button => button.addEventListener('click', openModal));
document.getElementById('modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
modal.addEventListener('close', updateFloatingCta);

function updateFloatingCta() {
  const isVisible = prospects.getBoundingClientRect().bottom <= 0
    && registerSection.getBoundingClientRect().top > window.innerHeight * .65
    && !modal.open;
  floatingCta.classList.toggle('is-visible', isVisible);
  floatingCta.setAttribute('aria-hidden', String(!isVisible));
  floatingCta.tabIndex = isVisible ? 0 : -1;
}

function registrationPayload(email) {
  const params = new URLSearchParams(window.location.search);
  return {
    email: email.trim(),
    telegram: email.trim(),
    page: window.location.href,
    utm_source: params.get('utm_source') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || ''
  };
}

function sendRegistration(payload) {
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    const queued = navigator.sendBeacon(appsScriptUrl, new Blob([body], {type: 'text/plain;charset=UTF-8'}));
    if (queued) return;
  }
  fetch(appsScriptUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {'Content-Type': 'text/plain;charset=utf-8'},
    body,
    keepalive: true
  }).catch(() => {});
}

function submitRegistration({input, error, button}) {
  showError(error, '');
  button.disabled = true;
  button.firstChild.textContent = 'Переходимо в Telegram ';
  sendRegistration(registrationPayload(input.value));
  if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
  setTimeout(() => window.location.assign(botUrl), 100);
}

registerForm.addEventListener('submit', event => {
  event.preventDefault();
  submitRegistration({
    input: document.getElementById('lead-email'),
    error: document.getElementById('register-error'),
    button: registerForm.querySelector('button[type="submit"]')
  });
});

modalForm.addEventListener('submit', event => {
  event.preventDefault();
  submitRegistration({
    input: document.getElementById('modal-email'),
    error: document.getElementById('modal-error'),
    button: document.getElementById('modal-submit')
  });
});

let scrollFrame = 0;
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    updateFloatingCta();
    scrollFrame = 0;
  });
}, {passive: true});
window.addEventListener('resize', updateFloatingCta);
updateFloatingCta();
