import { NextResponse } from 'next/server';

// Типы для улучшенных уведомлений
export interface TelegramNotification {
  type: 'visit' | 'spin' | 'conversion' | 'error' | 'bot_detected' | 'analytics' | 'performance';
  userId: string;
  data?: any;
  timestamp?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface TelegramStats {
  totalVisits: number;
  totalSpins: number;
  totalConversions: number;
  uniqueUsers: number;
  topCountries: Array<{ country: string; count: number }>;
  topDevices: Array<{ device: string; count: number }>;
}

// Эмодзи для разных типов событий
const EMOJIS = {
  visit: { new: '👤', returning: '🚶‍♂️' },
  spin: { win: '🎰', lose: '💸' },
  conversion: '🏆',
  error: '❌',
  bot_detected: '🤖',
  analytics: '📊',
  performance: '⚡',
  warning: '⚠️',
  success: '✅'
};

// Цветовые коды для Telegram (HTML)
const COLORS = {
  success: '#00FF00',
  warning: '#FFA500',
  error: '#FF0000',
  info: '#0080FF',
  neutral: '#808080'
};

export class TelegramNotifier {
  private botToken: string;
  private chatId: string;
  private stats: TelegramStats;
  private messageQueue: TelegramNotification[] = [];
  private isProcessing = false;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';
    this.stats = {
      totalVisits: 0,
      totalSpins: 0,
      totalConversions: 0,
      uniqueUsers: 0,
      topCountries: [],
      topDevices: []
    };
  }

  // Основная функция отправки сообщения
  async sendMessage(message: string, options?: {
    parseMode?: 'Markdown' | 'HTML';
    disableWebPagePreview?: boolean;
    disableNotification?: boolean;
  }) {
    if (!this.botToken || !this.chatId) {
      console.error('Telegram configuration is missing');
      return { success: false, error: 'Configuration missing' };
    }

    const telegramUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

    try {
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: options?.parseMode || 'Markdown',
          disable_web_page_preview: options?.disableWebPagePreview || true,
          disable_notification: options?.disableNotification || false
        })
      });

      const data = await response.json();
      return data.ok ? { success: true } : { success: false, error: data };
    } catch (error) {
      console.error('Telegram API error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Отправка уведомления о посещении
  async sendVisitNotification(data: {
    userId: string;
    isNew: boolean;
    ip: string;
    location?: { country: string; country_code: string };
    device: string;
    os: string;
    browser: string;
    userAgent: string;
    referrer?: string;
  }) {
    const emoji = data.isNew ? EMOJIS.visit.new : EMOJIS.visit.returning;
    const title = data.isNew ? 'New User Visit' : 'Returning User Visit';
    
    const message = `
${emoji} *${title}*

👤 *User:* \`#user${data.userId}\`
🌍 *Location:* ${data.location ? `${data.location.country} (${data.location.country_code})` : 'Unknown'}
📱 *Device:* ${data.device} / ${data.os} / ${data.browser}
🌐 *IP:* \`${data.ip}\`
${data.referrer ? `🔗 *Referrer:* ${data.referrer}` : ''}

⏰ *Time:* ${new Date().toLocaleString('ru-RU')}
    `.trim();

    return this.sendMessage(message);
  }

  // Отправка уведомления о спинах
  async sendSpinNotification(data: {
    userId: string;
    result: any;
    ip: string;
    location?: { country: string; country_code: string };
    device: string;
    os: string;
    browser: string;
  }) {
    const isWin = data.result.amount > 0;
    const emoji = isWin ? EMOJIS.spin.win : EMOJIS.spin.lose;
    const title = isWin ? '🎰 Spin Win!' : '💸 Spin Result';
    
    const message = `
${emoji} *${title}*

👤 *User:* \`#user${data.userId}\`
💰 *Prize:* ${data.result.amount} ${data.result.currency}
🎫 *Promocode:* \`${data.result.promocode}\`
🌍 *Location:* ${data.location ? `${data.location.country} (${data.location.country_code})` : 'Unknown'}
📱 *Device:* ${data.device} / ${data.os} / ${data.browser}
🌐 *IP:* \`${data.ip}\`

⏰ *Time:* ${new Date().toLocaleString('ru-RU')}
    `.trim();

    return this.sendMessage(message);
  }

  // Отправка уведомления о конверсиях
  async sendConversionNotification(data: {
    userId: string;
    result: any;
    ip: string;
    location?: { country: string; country_code: string };
    device: string;
    os: string;
    browser: string;
  }) {
    const message = `
${EMOJIS.conversion} *Conversion Event!*

👤 *User:* \`#user${data.userId}\`
💰 *Prize:* ${data.result.amount} ${data.result.currency}
🎫 *Promocode:* \`${data.result.promocode}\`
💵 *Local Prize:* ${data.result.localAmount}
🌍 *Location:* ${data.location ? `${data.location.country} (${data.location.country_code})` : 'Unknown'}
📱 *Device:* ${data.device} / ${data.os} / ${data.browser}
🌐 *IP:* \`${data.ip}\`

⏰ *Time:* ${new Date().toLocaleString('ru-RU')}
    `.trim();

    return this.sendMessage(message);
  }

  // Отправка уведомления о боте
  async sendBotDetectionNotification(data: {
    userAgent: string;
    botType: string;
    confidence: number;
    reasons: string[];
    ip: string;
  }) {
    const message = `
${EMOJIS.bot_detected} *Bot Detected*

🤖 *Type:* ${data.botType}
📊 *Confidence:* ${data.confidence}%
🔍 *Reasons:* ${data.reasons.join(', ')}
🌐 *IP:* \`${data.ip}\`
📱 *User-Agent:* \`${data.userAgent.substring(0, 100)}...\`

⏰ *Time:* ${new Date().toLocaleString('ru-RU')}
    `.trim();

    return this.sendMessage(message);
  }

  // Отправка статистики
  async sendStatsNotification(stats: TelegramStats) {
    const message = `
${EMOJIS.analytics} *Daily Statistics*

📊 *Total Visits:* ${stats.totalVisits}
🎰 *Total Spins:* ${stats.totalSpins}
🏆 *Total Conversions:* ${stats.totalConversions}
👥 *Unique Users:* ${stats.uniqueUsers}

🌍 *Top Countries:*
${stats.topCountries.slice(0, 5).map((country, index) => 
  `${index + 1}. ${country.country}: ${country.count}`
).join('\n')}

📱 *Top Devices:*
${stats.topDevices.slice(0, 5).map((device, index) => 
  `${index + 1}. ${device.device}: ${device.count}`
).join('\n')}

⏰ *Generated:* ${new Date().toLocaleString('ru-RU')}
    `.trim();

    return this.sendMessage(message);
  }

  // Отправка уведомления об ошибке
  async sendErrorNotification(data: {
    error: string;
    context?: string;
    userId?: string;
    stack?: string;
  }) {
    const message = `
${EMOJIS.error} *Error Alert*

❌ *Error:* ${data.error}
${data.context ? `📝 *Context:* ${data.context}` : ''}
${data.userId ? `👤 *User:* \`#user${data.userId}\`` : ''}
${data.stack ? `🔍 *Stack:* \`${data.stack.substring(0, 200)}...\`` : ''}

⏰ *Time:* ${new Date().toLocaleString('ru-RU')}
    `.trim();

    return this.sendMessage(message);
  }

  // Отправка уведомления о производительности
  async sendPerformanceNotification(data: {
    metric: string;
    value: number;
    threshold: number;
    userId?: string;
  }) {
    const isWarning = data.value > data.threshold;
    const emoji = isWarning ? EMOJIS.warning : EMOJIS.success;
    const title = isWarning ? 'Performance Warning' : 'Performance OK';

    const message = `
${emoji} *${title}*

📊 *Metric:* ${data.metric}
📈 *Value:* ${data.value}
🎯 *Threshold:* ${data.threshold}
${data.userId ? `👤 *User:* \`#user${data.userId}\`` : ''}

⏰ *Time:* ${new Date().toLocaleString('ru-RU')}
    `.trim();

    return this.sendMessage(message);
  }

  // Отправка HTML сообщения с форматированием
  async sendHTMLMessage(html: string, options?: { disableNotification?: boolean }) {
    return this.sendMessage(html, {
      parseMode: 'HTML',
      disableNotification: options?.disableNotification || false
    });
  }

  // Отправка интерактивного сообщения с кнопками
  async sendInteractiveMessage(text: string, buttons: Array<Array<{ text: string; callback_data: string }>>) {
    if (!this.botToken || !this.chatId) {
      return { success: false, error: 'Configuration missing' };
    }

    const telegramUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

    try {
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: text,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: buttons
          }
        })
      });

      const data = await response.json();
      return data.ok ? { success: true } : { success: false, error: data };
    } catch (error) {
      console.error('Telegram API error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Отправка фото с подписью
  async sendPhoto(caption: string, photoUrl: string) {
    if (!this.botToken || !this.chatId) {
      return { success: false, error: 'Configuration missing' };
    }

    const telegramUrl = `https://api.telegram.org/bot${this.botToken}/sendPhoto`;

    try {
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.chatId,
          photo: photoUrl,
          caption: caption,
          parse_mode: 'Markdown'
        })
      });

      const data = await response.json();
      return data.ok ? { success: true } : { success: false, error: data };
    } catch (error) {
      console.error('Telegram API error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Обновление статистики
  updateStats(type: 'visit' | 'spin' | 'conversion', data: any) {
    switch (type) {
      case 'visit':
        this.stats.totalVisits++;
        break;
      case 'spin':
        this.stats.totalSpins++;
        break;
      case 'conversion':
        this.stats.totalConversions++;
        break;
    }
  }

  // Получение текущей статистики
  getStats(): TelegramStats {
    return { ...this.stats };
  }

  // Отправка ежедневного отчета
  async sendDailyReport(data: {
    date: Date;
    totalVisits: number;
    totalSpins: number;
    conversionRate: number;
    topCountries: string[];
    revenue: string;
    newUsers?: number;
    returningUsers?: number;
  }) {
    const message = `
📊 *Daily Report - ${data.date.toLocaleDateString('ru-RU')}*

📈 *Key Metrics:*
• Total Visits: ${data.totalVisits.toLocaleString()}
• Total Spins: ${data.totalSpins.toLocaleString()}
• Conversion Rate: ${data.conversionRate}%
• Revenue: ${data.revenue}

👥 *Users:*
• New Users: ${data.newUsers || 'N/A'}
• Returning Users: ${data.returningUsers || 'N/A'}

🌍 *Top Countries:*
${data.topCountries.map((country, index) => `${index + 1}. ${country}`).join('\n')}

📅 *Report Period:* ${data.date.toLocaleDateString('ru-RU')}
⏰ *Generated:* ${new Date().toLocaleString('ru-RU')}
    `.trim();

    return this.sendMessage(message);
  }

  // Отправка еженедельного отчета
  async sendWeeklyReport(data: {
    week: string;
    growth: string;
    newUsers: number;
    topPerformers: string[];
    totalRevenue: string;
    avgConversionRate: number;
  }) {
    const message = `
📈 *Weekly Report - ${data.week}*

📊 *Performance:*
• Growth: ${data.growth}
• New Users: ${data.newUsers.toLocaleString()}
• Total Revenue: ${data.totalRevenue}
• Avg Conversion Rate: ${data.avgConversionRate}%

🏆 *Top Performers:*
${data.topPerformers.map((user, index) => `${index + 1}. ${user}`).join('\n')}

📅 *Week:* ${data.week}
⏰ *Generated:* ${new Date().toLocaleString('ru-RU')}
    `.trim();

    return this.sendMessage(message);
  }

  // Отправка алерта
  async sendAlert(data: {
    type: 'high_conversion' | 'suspicious_activity' | 'system_error' | 'performance_issue';
    message: string;
    threshold?: number;
    current?: number;
    ip?: string;
    count?: number;
  }) {
    const emoji = data.type === 'high_conversion' ? '🚀' : 
                  data.type === 'suspicious_activity' ? '⚠️' : 
                  data.type === 'system_error' ? '❌' : '⚡';
    
    const title = data.type === 'high_conversion' ? 'High Conversion Alert' :
                  data.type === 'suspicious_activity' ? 'Suspicious Activity Detected' :
                  data.type === 'system_error' ? 'System Error Alert' : 'Performance Issue';

    let details = '';
    if (data.threshold && data.current) {
      details = `\n📊 Threshold: ${data.threshold}%\n📈 Current: ${data.current}%`;
    }
    if (data.ip && data.count) {
      details = `\n🌐 IP: \`${data.ip}\`\n🔢 Count: ${data.count}`;
    }

    const message = `
${emoji} *${title}*

⚠️ *Alert:* ${data.message}${details}

⏰ *Time:* ${new Date().toLocaleString('ru-RU')}
    `.trim();

    return this.sendMessage(message);
  }
}

// Создаем глобальный экземпляр
export const telegramNotifier = new TelegramNotifier(); 