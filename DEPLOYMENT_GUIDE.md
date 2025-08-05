# Руководство по деплою Galaxy Wheel

## Подготовка к деплою

1. **Убедитесь, что все зависимости установлены локально:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Проверьте, что проект собирается локально:**
   ```bash
   npm run build
   ```

3. **Закоммитьте все файлы, включая:**
   - package.json
   - package-lock.json (если есть)
   - .npmrc
   - .nvmrc
   - .gitignore

## Настройки Netlify

### Переменные окружения
Установите следующие переменные окружения в настройках Netlify:

- `TELEGRAM_BOT_TOKEN` - токен вашего Telegram бота
- `TELEGRAM_CHAT_ID` - ID чата для уведомлений

### Настройки сборки
- **Build command:** `npm ci --legacy-peer-deps && npm run build`
- **Publish directory:** `.next`
- **Node version:** 18.18.0

## Решение проблем

### Ошибка "missing swc dependencies"
1. Убедитесь, что файл `.npmrc` содержит:
   ```
   legacy-peer-deps=true
   auto-install-peers=true
   ```

2. Проверьте, что в `netlify.toml` указан флаг `--legacy-peer-deps`

### Ошибки TypeScript
1. Запустите проверку типов локально:
   ```bash
   npx tsc --noEmit
   ```

2. Исправьте все ошибки типов перед деплоем

### Проблемы с зависимостями
1. Удалите `node_modules` и `package-lock.json`
2. Выполните `npm install --legacy-peer-deps`
3. Закоммитьте новый `package-lock.json`

## Мониторинг деплоя

После деплоя проверьте:
1. Логи сборки в Netlify
2. Работоспособность всех функций
3. Отправку уведомлений в Telegram 