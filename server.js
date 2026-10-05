const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DELIVERY_FEE = 10000;

app.post('/api/order', async (req, res) => {
  const {
    name,
    phone,
    address,
    type,
    payment,
    comment,
    items,
    latitude,
    longitude
  } = req.body || {};

  if (!name || !phone || !address || !items?.length) {
    return res.status(400).json({
      error: 'Заполните данные заказа'
    });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({
      error: 'Telegram не настроен'
    });
  }

  const itemsTotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  const deliveryFee = type === 'delivery' ? DELIVERY_FEE : 0;
  const total = itemsTotal + deliveryFee;

  const lines = items.map(item =>
    `• ${item.name} × ${item.qty} — ${Number(item.price * item.qty).toLocaleString('ru-RU')} сум`
  ).join('\n');

  let locationText = '';

  if (latitude && longitude) {
    const mapLink = `https://maps.google.com/?q=${latitude},${longitude}`;
    locationText = `\n\n📍 ТОЧНАЯ ЛОКАЦИЯ:\n${mapLink}`;
  }

  const text =
    `🔥 НОВЫЙ ЗАКАЗ VIBE\n\n` +
    `👤 Имя: ${name}\n` +
    `📞 Телефон: ${phone}\n` +
    `📍 Адрес: ${address}\n` +
    `🚚 Тип: ${type === 'delivery' ? 'Доставка' : 'Самовывоз'}\n` +
    `💳 Оплата: ${payment === 'cash' ? 'Наличными' : 'Картой'}\n\n` +
    `${lines}\n\n` +
    `🛒 ТОВАРЫ: ${itemsTotal.toLocaleString('ru-RU')} сум\n` +
    `🚚 ДОСТАВКА: ${deliveryFee.toLocaleString('ru-RU')} сум\n` +
    `💰 ИТОГО: ${total.toLocaleString('ru-RU')} сум` +
    `${comment ? `\n\n💬 Комментарий: ${comment}` : ''}` +
    locationText;

  try {
    const tg = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text
        })
      }
    );

    const data = await tg.json();

    if (!data.ok) {
      console.error('Telegram error:', data);
      return res.status(502).json({
        error: 'Telegram error'
      });
    }

    res.json({ ok: true });

  } catch (error) {
    console.error('Order error:', error);

    res.status(500).json({
      error: 'Не удалось отправить заказ'
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`VIBE site: http://localhost:${port}`);
});
