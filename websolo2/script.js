const modal = document.getElementById('registration-modal');
const modalForm = document.getElementById('modal-form');
const registerForm = document.getElementById('register-form');
const floatingCta = document.getElementById('floating-cta');
const prospects = document.getElementById('prospects');
const registerSection = document.getElementById('register');
const botUrl = 'https://telegram.me/Olga_Venher_bot?start=ZGw6MzQ0NzQx';
const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbzwJc3WujQnZAM9zXamnYjozZ5lHlhQaupKaO-nHe15yuuTktKUOCtb_t37iDKxi-Fb1A/exec';
const trackingParams = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'campaign_id', 'adset_id', 'ad_id', 'fbclid', 'placement'
];
const trackingStorageKey = 'websales2_tracking';

function setTomorrowDate() {
  const monthNames = [
    'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
    'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
  ];
  const tomorrow = new Date();
  tomorrow.setHours(12, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const label = `${tomorrow.getDate()} ${monthNames[tomorrow.getMonth()]}`;
  document.querySelectorAll('[data-tomorrow-date]').forEach(element => {
    element.textContent = label;
  });
}

setTomorrowDate();

function populateTrackingFields() {
  const params = new URLSearchParams(window.location.search);
  let stored = {};
  try {
    stored = JSON.parse(localStorage.getItem(trackingStorageKey) || '{}');
  } catch (_) {
    stored = {};
  }

  trackingParams.forEach(name => {
    if (params.has(name)) stored[name] = params.get(name) || '';
  });

  try {
    localStorage.setItem(trackingStorageKey, JSON.stringify(stored));
  } catch (_) {}

  document.querySelectorAll('[data-tracking-param]').forEach(field => {
    field.value = stored[field.name] || '';
  });
}

populateTrackingFields();

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

function registrationPayload(email, form) {
  const tracking = {};
  form.querySelectorAll('[data-tracking-param]').forEach(field => {
    tracking[field.name] = field.value;
  });
  return {
    email: email.trim(),
    telegram: email.trim(),
    page: window.location.href,
    ...tracking
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
  populateTrackingFields();
  button.disabled = true;
  button.firstChild.textContent = 'Переходимо в Telegram ';
  sendRegistration(registrationPayload(input.value, input.form));
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
