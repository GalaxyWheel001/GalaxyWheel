import { NextResponse } from 'next/server';

function escapeMarkdownV2(text: string) {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

export async function sendTelegramMessage(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('Telegram environment variables are not set');
    return NextResponse.json({ error: 'Telegram config missing' }, { status: 500 });
  }

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const safeMessage = escapeMarkdownV2(message);

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: safeMessage,
        parse_mode: 'MarkdownV2',
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API error:', data);
      // Не роняем сайт — просто логируем
      return NextResponse.json({ error: 'Telegram send failed' }, { status: 200 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    // Не роняем сайт
    return NextResponse.json({ error: 'Internal server handled' }, { status: 200 });
  }
}
