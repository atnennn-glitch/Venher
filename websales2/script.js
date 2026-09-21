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

function validTelegram(value) {
  return /^@?[A-Za-z0-9_]{5,32}$/.test(value.trim());
}

function openModal() {
  showError(document.getElementById('modal-error'), '');
  modal.showModal();
  document.getElementById('modal-telegram').focus();
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

function registrationPayload(telegram) {
  const params = new URLSearchParams(window.location.search);
  return {
    telegram: telegram.trim(),
    page: window.location.href,
    utm_source: params.get('utm_source') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || ''
  };
}

async function submitRegistration({input, error, button}) {
  if (!validTelegram(input.value)) {
    showError(error, 'Вкажи нікнейм Telegram у форматі @username.');
    input.focus();
    return;
  }

  showError(error, '');
  const originalLabel = button.firstChild.textContent;
  button.disabled = true;
  button.firstChild.textContent = 'Надсилаємо заявку ';

  try {
    await fetch(appsScriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {'Content-Type': 'text/plain;charset=utf-8'},
      body: JSON.stringify(registrationPayload(input.value))
    });
    if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
    window.location.assign(botUrl);
  } catch (requestError) {
    showError(error, 'Не вдалося надіслати заявку. Перевір інтернет і спробуй ще раз.');
    button.disabled = false;
    button.firstChild.textContent = originalLabel;
  }
}

registerForm.addEventListener('submit', event => {
  event.preventDefault();
  submitRegistration({
    input: document.getElementById('lead-telegram'),
    error: document.getElementById('register-error'),
    button: registerForm.querySelector('button[type="submit"]')
  });
});

modalForm.addEventListener('submit', event => {
  event.preventDefault();
  submitRegistration({
    input: document.getElementById('modal-telegram'),
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
