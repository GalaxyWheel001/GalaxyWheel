import { NextResponse } from 'next/server';

export async function sendTelegramMessage(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('Telegram environment variables are not set');
    return NextResponse.json(
      { error: 'Telegram configuration is missing on the server' },
      { status: 500 }
    );
  }

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API error:', data);
      return NextResponse.json(
        { error: 'Failed to send message to Telegram' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}