(() => {
  const timer = document.querySelector('[data-countdown]');
  const storageKey = 'venher-webinar-countdown-end';
  const storageVersionKey = 'venher-webinar-countdown-version';
  const countdownVersion = '10-minute-loop-v1';
  const countdownDuration = 10 * 60 * 1000;

  if (timer) {
    let deadline = Number(sessionStorage.getItem(storageKey));
    if (sessionStorage.getItem(storageVersionKey) !== countdownVersion || !deadline) {
      deadline = Date.now() + countdownDuration;
      sessionStorage.setItem(storageKey, String(deadline));
      sessionStorage.setItem(storageVersionKey, countdownVersion);
    }

    const renderTimer = () => {
      if (deadline <= Date.now()) {
        deadline = Date.now() + countdownDuration;
        sessionStorage.setItem(storageKey, String(deadline));
      }

      const remaining = deadline - Date.now();
      const totalSeconds = Math.ceil(remaining / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const timerInterval = window.setInterval(renderTimer, 1000);
    renderTimer();
  }

  const floatingCta = document.querySelector('#floating-cta');
  const secondScreen = document.querySelector('#learn');
  const finalRegistration = document.querySelector('#registration');

  if (floatingCta && secondScreen) {
    let finalVisible = false;
    const registrationObserver = new IntersectionObserver((entries) => {
      finalVisible = entries.some((entry) => entry.isIntersecting);
      updateFloatingCta();
    }, { threshold: 0.15 });

    const updateFloatingCta = () => {
      const secondScreenPassed = window.scrollY >= secondScreen.offsetTop + secondScreen.offsetHeight - 80;
      floatingCta.classList.toggle('visible', secondScreenPassed && !finalVisible);
    };

    if (finalRegistration) registrationObserver.observe(finalRegistration);
    window.addEventListener('scroll', updateFloatingCta, { passive: true });
    window.addEventListener('resize', updateFloatingCta);
    updateFloatingCta();
  }

  const carousel = document.querySelector('.solo-case-grid.case-scroll');
  document.querySelectorAll('.case-scroll-controls button').forEach((button, index) => {
    button.addEventListener('click', () => {
      const cardWidth = carousel?.querySelector('.solo-case-card')?.getBoundingClientRect().width || 450;
      carousel?.scrollBy({ left: (index === 0 ? -1 : 1) * (cardWidth + 16), behavior: 'smooth' });
    });
  });

  const modal = document.querySelector('#lead-modal');
  const leadForm = document.querySelector('#lead-form');
  const telegramUrl = 'https://telegram.me/Olga_Venher_bot?start=ZGw6MzQxODY0';
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
    status.textContent = 'Готово! Переходимо в Telegram…';
    if (typeof window.fbq === 'function') window.fbq('track', 'Lead');

    fetch(leadEndpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({ email, source: 'webinar_6_october' })
      }).catch(() => {});

    window.setTimeout(() => window.location.assign(telegramUrl), 450);
  });
})();
