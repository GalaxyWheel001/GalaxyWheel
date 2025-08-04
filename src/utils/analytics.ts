// Аналитика и мониторинг производительности

interface AnalyticsEvent {
  event: string;
  userId: string;
  timestamp: number;
  data?: any;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isInitialized = false;

  init() {
    if (this.isInitialized) return;
    
    // Отправляем события каждые 30 секунд
    setInterval(() => {
      this.flushEvents();
    }, 30000);

    // Отправляем события при закрытии страницы
    window.addEventListener('beforeunload', () => {
      this.flushEvents();
    });

    this.isInitialized = true;
  }

  track(event: string, data?: any) {
    const userId = localStorage.getItem('galaxy_wheel_user_id') || 'unknown';
    
    this.events.push({
      event,
      userId,
      timestamp: Date.now(),
      data
    });

    // Если событий много, отправляем немедленно
    if (this.events.length > 10) {
      this.flushEvents();
    }
  }

  private async flushEvents() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: eventsToSend })
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
      // Возвращаем события обратно в очередь
      this.events.unshift(...eventsToSend);
    }
  }

  // Отслеживание производительности
  trackPerformance(metric: string, value: number) {
    this.track('performance', { metric, value });
  }

  // Отслеживание ошибок
  trackError(error: Error, context?: string) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      context
    });
  }

  // Отслеживание пользовательских действий
  trackUserAction(action: string, data?: any) {
    this.track('user_action', { action, ...data });
  }
}

export const analytics = new Analytics();

// Автоматическое отслеживание производительности
export function initPerformanceTracking() {
  if (typeof window === 'undefined') return;

  // Отслеживаем время загрузки страницы
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    analytics.trackPerformance('page_load', loadTime);
  });

  // Отслеживаем ошибки
  window.addEventListener('error', (event) => {
    analytics.trackError(event.error, 'window_error');
  });

  // Отслеживаем необработанные промисы
  window.addEventListener('unhandledrejection', (event) => {
    analytics.trackError(new Error(event.reason), 'unhandled_promise');
  });
} 