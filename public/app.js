const menu = {
  hotdog: [
    ['Хот дог 1 сосиска', 10000], ['Хот дог 2 сосиски', 15000], ['Хот дог 3 сосиски', 18000], ['Хот дог 4 сосиски', 20000],
    ['Хот дог 1 Сосиска + 1 Шашлык', 24000], ['Хот дог 2 Сосиска + 1 Шашлык', 28000], ['Хот дог 2 Сосиска + 2 Шашлык', 35000],
    ['Хот дог Котлята', 32000], ['Хот дог Big Kotleta', 45000], ['Хот дог Куринный', 25000], ['Хот дог Казы', 25000], ['Хот дог Большой Казы', 35000]
  ],
  burger: [
    ['Gamburger', 20000], ['Cheeseburger', 25000], ['Double Burger', 35000], ['Double Cheese', 40000], ['VIBE Burger', 25000], ['VIBE Burger Chicken', 20000]
  ],
  sandwich: [['Club Sandwich', 35000]],
  fries: [['Фри', 15000]],
  drinks: [
    ['Фанта 1,5 литр', 16000], ['Фанта 1 литр', 12000], ['Фанта 0.5', 8000], ['Кола 1,5 литр', 16000], ['Кола 1 литр', 12000], ['Кола 0.5', 8000],
    ['Спрайт 1 литр', 12000], ['Спрайт 0,5 литр', 8000], ['FUSY чай 1 литр', 12000], ['FUSY чай 0,5 литр', 8000],
    ['Вода с газом 1 литр', 7000], ['Вода с газом 0,5 литр', 5000], ['Вода без газа 1 литр', 7000], ['Вода без газа 0,5 литр', 5000]
  ],
  combo: [
    ['Vibe Burger Combo', 35000], ['Vibe Chicken Combo', 30000], ['Гамбургер Дуо', 60000], ['HOT Dog Family', 105000], ['Бургер Family', 105000], ['Клаб сендвич', 40000]
  ],
  sauce: [['Кетчуп', 2000], ['Майонез', 2000], ['Сырный', 2000], ['Чесночный', 2000]]
};

const cats = [
  ['hotdog', '🌭 Хот-доги'], ['burger', '🍔 Бургеры'], ['sandwich', '🥪 Сэндвич'], ['fries', '🍟 Фри'],
  ['drinks', '🥤 Напитки'], ['combo', '🍟 Комбо'], ['sauce', '🥫 Соусы']
];

const DELIVERY_FEE = 10000;
let cart = [];
let customerLocation = null;

// Бесплатные фотографии с Unsplash. Для каждой категории используется подходящее фото.
const categoryImages = {
  hotdog: 'https://images.unsplash.com/photo-1605153722912-f3359f0bbc52?auto=format&fit=crop&w=900&q=80',
  burger: 'https://images.unsplash.com/photo-1550949875-181c4577566b?auto=format&fit=crop&w=900&q=80',
  sandwich: 'https://images.unsplash.com/photo-1637926704492-d4e33859b0ab?auto=format&fit=crop&w=900&q=80',
  fries: 'https://images.unsplash.com/photo-1529259266118-cf22737f713f?auto=format&fit=crop&w=900&q=80',
  drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80',
  combo: 'https://images.unsplash.com/photo-1550949875-181c4577566b?auto=format&fit=crop&w=900&q=80',
  sauce: 'https://images.unsplash.com/photo-1472476443962-9ebba3a7e2c7?auto=format&fit=crop&w=900&q=80'
};

const money = n => Number(n || 0).toLocaleString('ru-RU') + ' сум';

function renderCats() {
  document.getElementById('categories').innerHTML = cats.map((cat, index) => `
    <button class="${index === 0 ? 'active' : ''}" onclick="showCat('${cat[0]}', this)">${cat[1]}</button>
  `).join('');
}

function showCat(key, btn) {
  document.querySelectorAll('.cats button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  document.getElementById('menu').innerHTML = `
    <div class="grid">
      ${menu[key].map((item, index) => `
        <article class="card">
          <div class="card-image-wrap">
            <img class="card-image" src="${categoryImages[key]}" alt="${item[0]}" loading="lazy"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="emoji-fallback" style="display:none">${cats.find(c => c[0] === key)?.[1]?.split(' ')[0] || '🍔'}</div>
          </div>
          <h3>${item[0]}</h3>
          <div class="price">${money(item[1])}</div>
          <button class="add" onclick="addToCart('${key}', ${index})">ДОБАВИТЬ</button>
        </article>
      `).join('')}
    </div>
  `;
}

function addToCart(key, index) {
  const [name, price] = menu[key][index];
  const existing = cart.find(x => x.name === name);
  if (existing) existing.qty += 1;
  else cart.push({ name, price, qty: 1 });
  updateCart();
}

function changeQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateCart();
}

function getItemsTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getDeliveryFee() {
  const type = document.querySelector('input[name="type"]:checked')?.value || 'delivery';
  return type === 'delivery' && cart.length ? DELIVERY_FEE : 0;
}

function updateCart() {
  const itemsTotal = getItemsTotal();
  const deliveryFee = getDeliveryFee();
  const total = itemsTotal + deliveryFee;
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = money(total);
  document.getElementById('sumItems').textContent = money(itemsTotal);
  document.getElementById('deliveryCost').textContent = deliveryFee ? money(deliveryFee) : '0 сум';
  document.getElementById('grandTotal').textContent = money(total);

  const floating = document.getElementById('floatingCart');
  if (floating) floating.style.display = cart.length ? 'flex' : 'none';

  const cartItems = document.getElementById('cartItems');
  if (!cart.length) {
    cartItems.innerHTML = '<p class="muted">Корзина пуста.</p>';
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-row">
      <div><h4>${item.name}</h4><div class="muted">${money(item.price)} × ${item.qty}</div></div>
      <div class="qty"><button onclick="changeQty(${index}, -1)">−</button><span>${item.qty}</span><button onclick="changeQty(${index}, 1)">+</button></div>
    </div>
  `).join('');
}

function openCart() {
  document.getElementById('overlay')?.classList.add('open');
  updateCart();
}

function closeCart(event) {
  const overlay = document.getElementById('overlay');
  if (!overlay) return;
  if (!event || event.target === overlay) overlay.classList.remove('open');
}

function getLocation() {
  const note = document.getElementById('locationNote');
  if (!navigator.geolocation) { note.textContent = 'Геолокация не поддерживается вашим браузером.'; return; }
  note.textContent = 'Определяем вашу локацию…';
  navigator.geolocation.getCurrentPosition(position => {
    customerLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude };
    note.textContent = '✅ Локация определена. Координаты будут отправлены вместе с заказом.';
  }, error => {
    customerLocation = null;
    note.textContent = error.code === 1 ? 'Разрешите доступ к геолокации в браузере.' : 'Не удалось определить локацию.';
  }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
}

document.getElementById('orderForm').addEventListener('submit', async event => {
  event.preventDefault();
  if (!cart.length) { document.getElementById('formNote').textContent = 'Добавьте товары в корзину.'; return; }

  const form = new FormData(event.target);
  const itemsTotal = getItemsTotal();
  const deliveryFee = getDeliveryFee();
  const total = itemsTotal + deliveryFee;
  const payload = {
    name: form.get('name'), phone: form.get('phone'), address: form.get('address'), type: form.get('type'),
    payment: form.get('payment'), comment: form.get('comment'), items: cart.map(x => ({name:x.name, qty:x.qty, price:x.price})),
    itemsTotal, deliveryFee, total,
    latitude: customerLocation ? customerLocation.latitude : null,
    longitude: customerLocation ? customerLocation.longitude : null
  };

  const note = document.getElementById('formNote');
  note.textContent = 'Отправляем заказ…';
  try {
    const response = await fetch('/api/order', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
    if (!response.ok) throw new Error('Order failed');
    note.textContent = 'Заказ принят! Скоро с вами свяжутся.';
    cart = []; customerLocation = null; updateCart(); event.target.reset();
  } catch (error) {
    console.error(error);
    note.textContent = 'Не удалось отправить. Проверьте соединение и попробуйте ещё раз.';
  }
});

document.querySelectorAll('input[name="type"]').forEach(input => input.addEventListener('change', updateCart));

renderCats();
showCat('hotdog', document.querySelector('.cats button'));
updateCart();
