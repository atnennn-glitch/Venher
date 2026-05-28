async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }
  const rawBody = Buffer.concat(chunks).toString('utf8');
  return rawBody ? JSON.parse(rawBody) : {};
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { ok: false, error: 'Method not allowed' });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    console.error('[lead] Invalid JSON body:', error);
    return sendJson(res, 400, { ok: false, error: 'Invalid JSON body' });
  }

  const cleanPhone = String(body.phone || '').trim();
  const cleanTelegram = String(body.telegram || '').trim();

  if (!cleanPhone || !cleanTelegram) {
    console.error('[lead] Validation failed:', {
      hasPhone: Boolean(cleanPhone),
      hasTelegram: Boolean(cleanTelegram)
    });
    return sendJson(res, 400, { ok: false, error: 'Phone and Telegram are required' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('[lead] Telegram env variables are missing:', {
      hasToken: Boolean(token),
      hasChatId: Boolean(chatId)
    });
    return sendJson(res, 500, { ok: false, error: 'Telegram env variables are missing' });
  }

  const text = [
    '🔥 Нова заявка “Код продажів”',
    '',
    `Телефон: ${cleanPhone}`,
    `Telegram: ${cleanTelegram}`
  ].join('\n');

  console.log('[lead] Sending Telegram lead:', {
    chatId,
    phone: cleanPhone,
    telegram: cleanTelegram
  });

  let telegramResponse;
  let telegramPayload;

  try {
    telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text
      })
    });

    telegramPayload = await telegramResponse.json();
  } catch (error) {
    console.error('[lead] Telegram API request failed:', error);
    return sendJson(res, 502, { ok: false, error: 'Telegram API request failed' });
  }

  if (!telegramResponse.ok || telegramPayload.ok !== true) {
    console.error('[lead] Telegram API returned error:', {
      status: telegramResponse.status,
      payload: telegramPayload
    });
    return sendJson(res, 502, {
      ok: false,
      error: 'Telegram API returned error',
      telegram: telegramPayload
    });
  }

  console.log('[lead] Telegram lead sent:', {
    messageId: telegramPayload.result && telegramPayload.result.message_id
  });

  return sendJson(res, 200, {
    ok: true,
    messageId: telegramPayload.result && telegramPayload.result.message_id
  });
};
