# 🌌 Galaxy Wheel - Система Клоакинга для Netlify

## 📋 Описание

Улучшенная система клоакинга для Netlify с использованием Edge Functions. Система автоматически определяет ботов и подозрительную активность, перенаправляя их на безопасный сайт, а реальных пользователей - на основной ресурс.

## 🚀 Возможности

### 🤖 Определение ботов
- **User-Agent анализ**: Определение известных ботов (Googlebot, Bingbot, Facebook, curl, AhrefsBot и др.)
- **Заголовки браузера**: Проверка стандартных заголовков браузера
- **Паттерны поведения**: Анализ подозрительных паттернов в запросах

### 🌍 GeoIP фильтрация
- **Определение страны**: Использование встроенных заголовков Netlify + внешний API ipapi.co
- **Разрешенные страны**: AZ, RU, KZ, UA, BY, UZ, AM, GE, MD, RO, BG, HR, SI, SK, CZ, PL, HU, EE, LV, LT, MT, CY, GR, IT, ES, PT, FR, BE, NL, DE, AT, CH, LI, LU, MC, AD, GB, IE, IS, NO, SE, DK, FI, AL, MK, RS, ME, BA, XK, TR
- **Автоматический редирект**: Пользователи из неразрешенных стран перенаправляются как боты

### 🔒 JavaScript Challenge
- **Интерактивная проверка**: Красивая страница с прогресс-баром
- **Проверки браузера**: Валидация современных API, плагинов, размеров экрана
- **Отслеживание взаимодействия**: Проверка движений мыши, кликов, нажатий клавиш
- **Защита от автоматизации**: Обнаружение headless браузеров и скриптов

### 🛡️ Дополнительная защита
- **Анализ IP**: Проверка подозрительных IP адресов
- **Поведенческий анализ**: Обнаружение подозрительных паттернов в запросах
- **Защита от сканеров**: Блокировка известных сканеров и автоматизированных инструментов

## 📁 Структура проекта

```
netlify/
└── edge-functions/
    ├── bot-detector.ts      # Определение ботов и GeoIP
    ├── redirect-config.ts   # Конфигурация редиректов
    ├── bot-redirect.ts      # Основная Edge Function
    └── enhanced-protection.ts # Дополнительная защита

public/
└── js-challenge.html        # Страница JS challenge

netlify.toml                 # Конфигурация Netlify
```

## ⚙️ Конфигурация

### Основные настройки (redirect-config.ts)

```typescript
export const DEFAULT_CLOAKING_CONFIG: CloakingConfig = {
  botRedirect: 'https://www.gamixlabs.com/blog.html',    // URL для ботов
  realUserRedirect: 'https://galaxy-casino.live',        // URL для пользователей
  jsChallengeUrl: '/js-challenge.html',                  // URL JS challenge
  allowedCountries: ['AZ', 'RU', 'KZ', ...],            // Разрешенные страны
  cookieName: 'galaxy_visited',                          // Имя куки
  cookieMaxAge: 60 * 60 * 24 * 30,                      // Время жизни куки (30 дней)
  cacheControl: 'no-cache, no-store, must-revalidate'   // Заголовки кэширования
};
```

### Настройка разрешенных стран (bot-detector.ts)

```typescript
const ALLOWED_COUNTRIES = [
  'AZ', 'RU', 'KZ', 'UA', 'BY', 'UZ', 'AM', 'GE', 'MD', 'RO', 
  'BG', 'HR', 'SI', 'SK', 'CZ', 'PL', 'HU', 'EE', 'LV', 'LT', 
  'MT', 'CY', 'GR', 'IT', 'ES', 'PT', 'FR', 'BE', 'NL', 'DE', 
  'AT', 'CH', 'LI', 'LU', 'MC', 'AD', 'GB', 'IE', 'IS', 'NO', 
  'SE', 'DK', 'FI', 'AL', 'MK', 'RS', 'ME', 'BA', 'XK', 'TR'
];
```

## 🚀 Развертывание

### 1. Подготовка проекта

```bash
# Клонируйте репозиторий
git clone <your-repo>
cd GalaxyWheel-main

# Установите зависимости
npm install
```

### 2. Настройка Netlify

1. **Создайте новый сайт** в Netlify Dashboard
2. **Подключите репозиторий** GitHub/GitLab
3. **Настройте переменные окружения** (если нужно):
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token
   TELEGRAM_CHAT_ID=your_chat_id
   ```

### 3. Настройка доменов

В файле `netlify.toml` обновите URL:

```toml
[functions]
  directory = "netlify/edge-functions"

[[redirects]]
  from = "/*"
  to = "/.netlify/edge-functions/bot-redirect"
  status = 200
  force = true
```

### 4. Развертывание

```bash
# Закоммитьте изменения
git add .
git commit -m "Add cloaking system"
git push

# Netlify автоматически развернет сайт
```

## 🔧 Настройка и кастомизация

### Изменение URL редиректов

Отредактируйте `netlify/edge-functions/redirect-config.ts`:

```typescript
export const DEFAULT_CLOAKING_CONFIG: CloakingConfig = {
  botRedirect: 'https://your-safe-site.com',           // Ваш безопасный сайт
  realUserRedirect: 'https://your-main-site.com',      // Ваш основной сайт
  // ... остальные настройки
};
```

### Добавление новых стран

Отредактируйте `netlify/edge-functions/bot-detector.ts`:

```typescript
const ALLOWED_COUNTRIES = [
  // Добавьте новые коды стран
  'US', 'CA', 'MX', // пример
  // ... существующие страны
];
```

### Настройка подозрительных IP

Отредактируйте `netlify/edge-functions/enhanced-protection.ts`:

```typescript
const SUSPICIOUS_IPS = [
  '1.2.3.4',    // Добавьте известные IP сканеров
  '5.6.7.8',
  // ...
];
```

### Кастомизация JS Challenge

Отредактируйте `public/js-challenge.html`:
- Измените дизайн и стили
- Добавьте дополнительные проверки
- Настройте время выполнения

## 📊 Логирование и мониторинг

### Логи в Netlify

Все логи доступны в Netlify Dashboard:
- **Functions logs**: Логи Edge Functions
- **Deploy logs**: Логи развертывания

### Примеры логов

```
🔍 Request Analysis: {
  path: "/",
  isBot: false,
  botType: undefined,
  confidence: 0,
  country: "RU",
  ip: "192.168.1.1",
  reasons: [],
  protectionRisk: "low",
  protectionReasons: []
}

🚫 Redirecting bot (search) to: https://www.gamixlabs.com/blog.html

🔒 Showing JS challenge for new user

✅ User has visited cookie, redirecting to main site
```

## 🛡️ Безопасность

### Защитные механизмы

1. **Многоуровневая проверка**:
   - User-Agent анализ
   - Заголовки браузера
   - GeoIP фильтрация
   - JavaScript challenge
   - Поведенческий анализ

2. **Защита от обхода**:
   - Проверка современных браузерных API
   - Отслеживание взаимодействия пользователя
   - Анализ времени выполнения
   - Проверка плагинов и размеров экрана

3. **Кэширование**:
   - Отключение кэширования для редиректов
   - Безопасные заголовки
   - Защита от фреймов

### Рекомендации по безопасности

1. **Регулярно обновляйте** списки ботов и подозрительных IP
2. **Мониторьте логи** на предмет новых паттернов атак
3. **Тестируйте систему** с различными ботами и сканерами
4. **Настройте уведомления** в Telegram для подозрительной активности

## 🔍 Тестирование

### Тестирование с ботами

```bash
# Тест с curl (должен быть редирект на ботовский сайт)
curl -H "User-Agent: curl/7.68.0" https://your-site.netlify.app

# Тест с Googlebot (должен быть редирект на ботовский сайт)
curl -H "User-Agent: Googlebot/2.1" https://your-site.netlify.app
```

### Тестирование с реальными пользователями

1. **Откройте сайт** в обычном браузере
2. **Пройдите JS challenge** (если это первый визит)
3. **Проверьте редирект** на основной сайт
4. **Проверьте куку** `galaxy_visited`

### Тестирование GeoIP

```bash
# Тест с IP из неразрешенной страны (должен быть редирект как бот)
curl -H "X-Forwarded-For: 8.8.8.8" https://your-site.netlify.app
```

## 🚨 Устранение неполадок

### Проблемы с развертыванием

1. **Проверьте логи развертывания** в Netlify Dashboard
2. **Убедитесь в правильности** структуры Edge Functions
3. **Проверьте синтаксис TypeScript**

### Проблемы с редиректами

1. **Проверьте конфигурацию** в `netlify.toml`
2. **Убедитесь в доступности** URL редиректов
3. **Проверьте логи Edge Functions**

### Проблемы с GeoIP

1. **Проверьте доступность** API ipapi.co
2. **Убедитесь в правильности** заголовков Netlify
3. **Проверьте список разрешенных стран**

## 📈 Производительность

### Оптимизации

1. **Кэширование GeoIP**: Использование встроенных заголовков Netlify
2. **Быстрые проверки**: Приоритизация простых проверок
3. **Минимальные запросы**: Оптимизация внешних API вызовов

### Мониторинг

- **Время ответа**: Edge Functions обычно < 100ms
- **Использование памяти**: Минимальное потребление
- **Количество запросов**: Логирование для анализа

## 🔄 Обновления

### Регулярные обновления

1. **Списки ботов**: Обновляйте паттерны ботов
2. **Подозрительные IP**: Добавляйте новые IP сканеров
3. **JavaScript challenge**: Улучшайте защиту от автоматизации

### Версионирование

- Используйте семантическое версионирование
- Тестируйте изменения в staging окружении
- Документируйте все изменения

## 📞 Поддержка

При возникновении проблем:

1. **Проверьте логи** в Netlify Dashboard
2. **Изучите документацию** Netlify Edge Functions
3. **Создайте issue** в репозитории проекта

---

**⚠️ Важно**: Эта система предназначена для защиты от автоматизированных сканеров. Убедитесь в соблюдении всех применимых законов и правил при использовании.
