function sendJson(response, status, payload) {
  response.status(status).json(payload);
}

function escapeHtml(value) {
  return String(value || '—')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

module.exports = async function telegramHandler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, {
      success: false,
      error: 'Метод не підтримується.'
    });
  }

  let body;
  try {
    body = typeof request.body === 'string'
      ? JSON.parse(request.body || '{}')
      : (request.body || {});
  } catch {
    return sendJson(response, 400, {
      success: false,
      error: 'Некоректний формат заявки.'
    });
  }

  // Honeypot: спам-ботам повертаємо успіх, але повідомлення не надсилаємо.
  if (String(body.website || '').trim()) {
    return sendJson(response, 200, { success: true });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('Telegram environment variables are missing.');
    return sendJson(response, 500, {
      success: false,
      error: 'Сервіс заявок тимчасово недоступний.'
    });
  }

  const name = String(body.name || '').trim();
  const telegram = String(body.telegram || '').trim();
  const phone = String(body.phone || '').trim();
  const managers = String(body.managers || '').trim();
  const niche = String(body.niche || '').trim();
  const difficulties = String(body.difficulties || '').trim();
  const pageUrl = String(body.pageUrl || request.headers.referer || '').trim();
  const isPersonalReview = Object.prototype.hasOwnProperty.call(body, 'managers');

  if (isPersonalReview && !telegram) {
    return sendJson(response, 400, {
      success: false,
      error: 'Вкажіть Telegram-нік.'
    });
  }

  if (!phone) {
    return sendJson(response, 400, {
      success: false,
      error: 'Вкажіть номер телефону.'
    });
  }

  if (phone.length > 40) {
    return sendJson(response, 400, {
      success: false,
      error: 'Перевірте правильність номера телефону.'
    });
  }

  const submittedDate = body.submittedAt && !Number.isNaN(Date.parse(body.submittedAt))
    ? new Date(body.submittedAt)
    : new Date();
  const submittedAt = new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'Europe/Kyiv',
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(submittedDate);

  const message = isPersonalReview
    ? [
        '🔥 <b>Нова заявка на особистий розбір</b>',
        '',
        `✈️ <b>Telegram:</b> ${escapeHtml(telegram)}`,
        `📞 <b>Телефон:</b> ${escapeHtml(phone)}`,
        `👥 <b>Кількість менеджерів:</b> ${escapeHtml(managers)}`,
        '',
        `🔗 <b>Сторінка:</b> ${escapeHtml(pageUrl)}`,
        `🕒 <b>Дата і час:</b> ${escapeHtml(submittedAt)}`
      ].join('\n')
    : [
        '🔥 <b>Нова заявка на консультацію</b>',
        '',
        `👤 <b>Ім’я:</b> ${escapeHtml(name)}`,
        `✈️ <b>Telegram:</b> ${escapeHtml(telegram)}`,
        `📞 <b>Телефон:</b> ${escapeHtml(phone)}`,
        `💼 <b>Ніша:</b> ${escapeHtml(niche)}`,
        '',
        `<b>Складнощі:</b>\n${escapeHtml(difficulties)}`,
        '',
        `🔗 <b>Сторінка:</b> ${escapeHtml(pageUrl)}`,
        `🕒 <b>Дата і час:</b> ${escapeHtml(submittedAt)}`
      ].join('\n');

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      }
    );

    const telegramResult = await telegramResponse.json().catch(() => null);

    if (!telegramResponse.ok || !telegramResult?.ok) {
      console.error('Telegram API error:', telegramResult);
      return sendJson(response, 502, {
        success: false,
        error: 'Telegram не прийняв заявку. Спробуйте ще раз.'
      });
    }

    return sendJson(response, 200, { success: true });
  } catch (error) {
    console.error('Telegram request failed:', error);
    return sendJson(response, 500, {
      success: false,
      error: 'Не вдалося надіслати заявку. Спробуйте ще раз.'
    });
  }
};
