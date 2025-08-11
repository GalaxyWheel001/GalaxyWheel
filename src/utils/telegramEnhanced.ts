export const telegramNotifier = {
  escapeMarkdownV2(text: string) {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
  },

  async sendAlert({
    type = 'system_error',
    message = 'Alert triggered',
    threshold,
    current,
    ip,
    count
  }: {
    type?: string;
    message?: string;
    threshold?: number;
    current?: number;
    ip?: string;
    count?: number;
  }) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Telegram config is missing');
      return { success: false, error: 'Missing bot token or chat id' };
    }

    const fullMessage = `
🚨 *${type.toUpperCase()}*
${message}
${threshold !== undefined ? `Threshold: ${threshold}` : ''}
${current !== undefined ? `Current: ${current}` : ''}
${ip ? `IP: ${ip}` : ''}
${count !== undefined ? `Count: ${count}` : ''}
    `.trim();

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: this.escapeMarkdownV2(fullMessage),
          parse_mode: 'MarkdownV2'
        })
      });

      const data = await response.json();

      if (!data.ok) {
        console.error('Telegram API error:', data);
        return { success: false, error: 'Telegram API error', details: data };
      }

      return { success: true };
    } catch (err) {
      console.error('Failed to send Telegram alert:', err);
      return { success: false, error: 'Internal error while sending alert' };
    }
  }
};
