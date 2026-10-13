const modal = document.getElementById('modal');
const modalForm = document.getElementById('modal-form');
const leadForm = document.getElementById('lead-form');
const floatCta = document.getElementById('float-cta');
const program = document.getElementById('program');
const register = document.getElementById('register');
const botUrl = 'https://telegram.me/Olga_Venher_bot?start=ZGw6MzQxMTM4';
const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbzwJc3WujQnZAM9zXamnYjozZ5lHlhQaupKaO-nHe15yuuTktKUOCtb_t37iDKxi-Fb1A/exec';

const showError = (element, message) => {
  element.textContent = message;
  element.hidden = !message;
};

function updateFloat() {
  const show = program.getBoundingClientRect().top < innerHeight * .45
    && register.getBoundingClientRect().top > innerHeight * .65
    && !modal.open;
  floatCta.classList.toggle('is-visible', show);
  floatCta.setAttribute('aria-hidden', String(!show));
  floatCta.tabIndex = show ? 0 : -1;
}

function openModal() {
  showError(document.getElementById('modal-error'), '');
  modal.showModal();
  document.getElementById('email').focus();
  updateFloat();
}

function registrationPayload(email) {
  const params = new URLSearchParams(location.search);
  return {
    email: email.trim(),
    telegram: email.trim(),
    page: location.href,
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
    keepalive: true,
    headers: {'Content-Type': 'text/plain;charset=utf-8'},
    body
  }).catch(() => {});
}

function submitRegistration({input, error, button}) {
  showError(error, '');
  button.disabled = true;
  button.firstChild.textContent = 'Переходимо в Telegram ';
  sendRegistration(registrationPayload(input.value));
  if (typeof fbq === 'function') fbq('track', 'Lead');
  setTimeout(() => location.assign(botUrl), 100);
}

document.querySelectorAll('.js-open-modal').forEach(button => button.addEventListener('click', openModal));
document.getElementById('close').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
modal.addEventListener('close', updateFloat);

leadForm.addEventListener('submit', event => {
  event.preventDefault();
  submitRegistration({
    input: document.getElementById('email-bottom'),
    error: document.getElementById('lead-error'),
    button: leadForm.querySelector('button[type="submit"]')
  });
});

modalForm.addEventListener('submit', event => {
  event.preventDefault();
  submitRegistration({
    input: document.getElementById('email'),
    error: document.getElementById('modal-error'),
    button: document.getElementById('modal-submit')
  });
});

let frame = 0;
addEventListener('scroll', () => {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    updateFloat();
    frame = 0;
  });
}, {passive: true});
addEventListener('resize', updateFloat);
updateFloat();
