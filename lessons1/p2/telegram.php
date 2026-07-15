<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Метод не підтримується.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$config = [];
$configFile = __DIR__ . '/telegram-config.php';
if (is_file($configFile)) {
    $config = require $configFile;
}

$botToken = (string)($config['bot_token'] ?? (getenv('TELEGRAM_BOT_TOKEN') ?: ''));
$chatId = (string)($config['chat_id'] ?? (getenv('TELEGRAM_CHAT_ID') ?: ''));

if ($botToken === '' || $chatId === '') {
    http_response_code(503);
    echo json_encode(['ok' => false, 'message' => 'Telegram ще не налаштований.'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!preg_match('/^[0-9]+:[A-Za-z0-9_-]+$/', $botToken)) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'message' => 'Некоректний токен Telegram-бота.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Невидиме поле-пастка від простих спам-ботів.
if (trim((string)($_POST['website'] ?? '')) !== '') {
    echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

$phone = trim((string)($_POST['phone'] ?? ''));
$telegram = trim((string)($_POST['telegram'] ?? ''));
$niche = trim((string)($_POST['niche'] ?? ''));
$difficulties = trim((string)($_POST['difficulties'] ?? ''));

if ($phone === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Вкажіть номер телефону.'], JSON_UNESCAPED_UNICODE);
    exit;
}

function safe(string $value): string {
    return htmlspecialchars($value !== '' ? $value : '—', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$message = "🔥 <b>Нова заявка на консультацію</b>\n\n"
    . "📞 <b>Телефон:</b> " . safe($phone) . "\n"
    . "✈️ <b>Telegram:</b> " . safe($telegram) . "\n"
    . "💼 <b>Ніша:</b> " . safe($niche) . "\n\n"
    . "💬 <b>Складнощі:</b>\n" . safe($difficulties);

$url = 'https://api.telegram.org/bot' . $botToken . '/sendMessage';
$payload = http_build_query([
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'HTML',
    'disable_web_page_preview' => 'true',
]);

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
        'content' => $payload,
        'timeout' => 10,
        'ignore_errors' => true,
    ],
]);

$telegramResponse = @file_get_contents($url, false, $context);
$telegramResult = $telegramResponse !== false ? json_decode($telegramResponse, true) : null;

if (!is_array($telegramResult) || empty($telegramResult['ok'])) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'message' => 'Telegram не прийняв заявку. Спробуйте ще раз.'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
