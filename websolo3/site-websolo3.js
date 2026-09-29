(() => {
  const carousel = document.querySelector('.solo-case-grid.case-scroll');
  document.querySelectorAll('.case-scroll-controls button').forEach((button, index) => {
    button.addEventListener('click', () => {
      const cardWidth = carousel?.querySelector('.solo-case-card')?.getBoundingClientRect().width || 450;
      carousel?.scrollBy({ left: (index === 0 ? -1 : 1) * (cardWidth + 16), behavior: 'smooth' });
    });
  });

  const modal = document.querySelector('#lead-modal');
  const leadForm = document.querySelector('#lead-form');
  const paymentUrl = 'https://secure.wayforpay.com/payment/s6d6259d66747';
  const leadEndpoint = window.location.hostname.endsWith('chatgpt.site')
    ? '/api/leads'
    : 'https://sami-sobi-viddil-prodazhiv-olia.atnennn.chatgpt.site/api/leads';

  const openModal = (event) => {
    event?.preventDefault();
    if (!modal) return;
    modal.showModal();
    document.documentElement.classList.add('modal-open');
    window.setTimeout(() => modal.querySelector('input')?.focus(), 80);
  };

  const closeModal = () => {
    if (!modal?.open) return;
    modal.close();
    document.documentElement.classList.remove('modal-open');
  };

  document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
    trigger.addEventListener('click', openModal);
  });
  modal?.querySelector('[data-close-modal]')?.addEventListener('click', closeModal);
  modal?.addEventListener('close', () => document.documentElement.classList.remove('modal-open'));
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  leadForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const emailInput = leadForm.querySelector('input[name="email"]');
    const submitButton = leadForm.querySelector('button[type="submit"]');
    const status = leadForm.querySelector('.form-status');
    const email = emailInput?.value.trim() || '';

    if (!emailInput?.checkValidity()) {
      emailInput?.reportValidity();
      return;
    }

    submitButton.disabled = true;
    status.classList.remove('success');
    status.textContent = 'Зберігаємо вашу заявку…';

    status.classList.add('success');
    status.textContent = 'Готово! Переходимо до оплати…';
    if (typeof window.fbq === 'function') window.fbq('track', 'Lead');

    fetch(leadEndpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({ email, source: 'webinar_6_october_paid_1usd_test_copy' })
      }).catch(() => {});

    window.setTimeout(() => window.location.assign(paymentUrl), 450);
  });
})();
