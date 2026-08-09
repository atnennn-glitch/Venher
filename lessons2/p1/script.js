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
  iframe.title = document.title;
  iframe.allow = 'autoplay; fullscreen; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  videoFrame.append(iframe);
  const lessonLabel = document.querySelector('.kicker')?.textContent || 'Урок';
  videoHint.textContent = `${lessonLabel} · Ольга Венгерець`;
});

consultationForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = consultationForm.querySelector('button[type="submit"]');
  const submitLabel = submitButton.querySelector('span:first-child');

  formError.hidden = true;
  submitButton.disabled = true;
  submitLabel.textContent = 'Надсилаємо…';

  try {
    const formData = new FormData(consultationForm);
    const payload = Object.fromEntries(formData.entries());
    payload.pageUrl = window.location.href;
    payload.submittedAt = new Date().toISOString();

    const response = await fetch(consultationForm.action, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const responseText = await response.text();
    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error('Сервер повернув некоректну відповідь. Спробуйте ще раз пізніше.');
    }

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Не вдалося надіслати заявку.');
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
    submitLabel.textContent = 'Отримати безкоштовну консультацію';
  }
});
