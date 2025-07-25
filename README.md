# Galaxy Wheel

## Описание

Galaxy Wheel — это приложение на Next.js/Bun с поддержкой мультиязычности, ассистентом и интеграцией с Telegram для уведомлений.

---

## Быстрый старт

1. Клонируйте репозиторий:
   ```sh
   git clone <URL_вашего_репозитория>
   cd galaxy-wheel
   ```
2. Установите зависимости:
   ```sh
   bun install
   # или
   npm install
   ```
3. Запустите локально:
   ```sh
   bun run dev
   # или
   npm run dev
   ```

---

## Деплой на Netlify

### 1. Подготовьте проект
- Убедитесь, что все исходные файлы загружены в репозиторий (см. .gitignore).

### 2. Зарегистрируйтесь/войдите на Netlify
- https://netlify.com/

### 3. Импортируйте проект
- Add new site → Import an existing project → выберите ваш репозиторий.

### 4. Настройте сборку
- **Build command:**
  - Для bun: `bun run build`
  - Для npm: `npm run build`
- **Publish directory:** `.next`
- **Base directory:** (оставьте пустым)

### 5. Добавьте переменные окружения
- В Netlify: Site settings → Environment variables:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`

Подробнее: https://docs.netlify.com/configure-builds/environment-variables/

### 6. Деплойте сайт
- Нажмите Deploy site.

### 7. Настройте поддомен
- Domain management → Add custom domain → введите ваш поддомен (например, wheel.yoursite.com).
- Добавьте CNAME-запись у вашего регистратора.

Подробнее: https://docs.netlify.com/domains-https/custom-domains/

### 8. Обновите webhook Telegram
- После деплоя получите URL: `https://wheel.yoursite.com/api/notify`
- Откройте в браузере:
  ```
  https://api.telegram.org/bot<ВАШ_ТОКЕН>/setWebhook?url=https://wheel.yoursite.com/api/notify
  ```
- Документация: https://core.telegram.org/bots/api#setwebhook

---

## Пример .env.example

```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

---

## Важно
- Не загружайте реальные .env файлы в репозиторий!
- Все временные и кэшированные файлы игнорируются через .gitignore.

---

## Поддержка
Если возникнут вопросы — пишите! 