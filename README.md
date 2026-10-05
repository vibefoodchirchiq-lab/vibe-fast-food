# VIBE FAST FOOD — сайт заказов

Готовый мобильный сайт с меню, корзиной и формой заказа.
Заказы отправляются в Telegram через серверный endpoint `/api/order`.

## Запуск
1. Установите Node.js 18+.
2. В папке проекта выполните:
   npm install
3. Скопируйте `.env.example` в `.env`.
4. Заполните:
   TELEGRAM_BOT_TOKEN
   TELEGRAM_CHAT_ID
5. Запустите:
   npm start
6. Откройте http://localhost:3000

## Важно
Telegram-токен нельзя помещать в `app.js` или другой файл фронтенда. Он хранится только в `.env` на сервере.

## Структура
- public/index.html — сайт
- public/style.css — дизайн
- public/app.js — меню и корзина
- server.js — отправка заказов в Telegram
