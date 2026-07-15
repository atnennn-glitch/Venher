const videoFrame = document.querySelector('#videoFrame');
const playButton = document.querySelector('#playButton');
const videoHint = document.querySelector('#videoHint');
const consultationForm = document.querySelector('#consultationForm');
const formSuccess = document.querySelector('#formSuccess');
const formError = document.querySelector('#formError');

// Вставте сюди embed-посилання YouTube або Vimeo, наприклад:
// https://www.youtube.com/embed/VIDEO_ID
// https://player.vimeo.com/video/VIDEO_ID
const VIDEO_URL = videoFrame.dataset.videoUrl.trim();

playButton.addEventListener('click', () => {
  if (!VIDEO_URL) {
    videoHint.textContent = 'Відео готове до підключення — додайте посилання у data-video-url в index.html';
    videoHint.classList.add('is-notice');
    return;
  }

  const iframe = document.createElement('iframe');
  const separator = VIDEO_URL.includes('?') ? '&' : '?';
  const playerParams = new URLSearchParams({
    autoplay: '1',
    playsinline: '1',
    rel: '0'
  });

  // YouTube використовує origin для ідентифікації сайту з вбудованим плеєром.
  // Для локального file:// origin не існує, тому перевіряти відео потрібно через HTTP/HTTPS.
  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    playerParams.set('origin', window.location.origin);
  }

  iframe.src = `${VIDEO_URL}${separator}${playerParams.toString()}`;
  iframe.title = 'Урок 1 — Заперечення «Я подумаю»';
  iframe.allow = 'autoplay; fullscreen; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  videoFrame.append(iframe);
  videoHint.textContent = 'Урок 1 · Ольга Венгерець';
});

consultationForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = consultationForm.querySelector('button[type="submit"]');
  const submitLabel = submitButton.querySelector('span:first-child');

  formError.hidden = true;
  submitButton.disabled = true;
  submitLabel.textContent = 'Надсилаємо…';

  try {
    const response = await fetch(consultationForm.action, {
      method: 'POST',
      body: new FormData(consultationForm),
      headers: { Accept: 'application/json' }
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.message || 'Не вдалося надіслати заявку.');
    }

    formSuccess.hidden = false;
    consultationForm.reset();
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead');
    }
  } catch (error) {
    formError.textContent = error.message || 'Сталася помилка. Спробуйте ще раз.';
    formError.hidden = false;
  } finally {
    submitButton.disabled = false;
    submitLabel.textContent = 'Записатися на консультацію';
  }
});
