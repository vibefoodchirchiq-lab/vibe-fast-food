const menu = {
  hotdog: [
    ['Хот дог 1 сосиска', 10000, '🌭'],
    ['Хот дог 2 сосиски', 15000, '🌭'],
    ['Хот дог 3 сосиски', 18000, '🌭'],
    ['Хот дог 4 сосиски', 20000, '🌭'],
    ['Хот дог 1 Сосиска + 1 Шашлык', 24000, '🌭'],
    ['Хот дог 2 Сосиска + 1 Шашлык', 28000, '🌭'],
    ['Хот дог 2 Сосиска + 2 Шашлык', 35000, '🌭'],
    ['Хот дог Котлята', 32000, '🌭'],
    ['Хот дог Big Kotletа', 45000, '🌭'],
    ['Хот дог Куринный', 25000, '🌭'],
    ['Хот дог Казы', 25000, '🌭'],
    ['Хот дог Большой Казы', 35000, '🌭']
  ],
  burger: [
    ['Gamburger', 20000, '🍔'], ['Cheeseburger', 25000, '🍔'],
    ['Double Burger', 35000, '🍔'], ['Double Cheese', 40000, '🍔'],
    ['VIBE Burger', 25000, '🍔'], ['VIBE Burger Chicken', 20000, '🍔']
  ],
  sandwich: [['Club Sandwich', 35000, '🥪']],
  fries: [['Фри', 15000, '🍟']],
  drinks: [
    ['Фанта 1,5 литр', 16000, '🥤'], ['Фанта 1 литр', 12000, '🥤'],
    ['Фанта 0.5', 8000, '🥤'], ['Кола 1,5 литр', 16000, '🥤'],
    ['Кола 1 литр', 12000, '🥤'], ['Кола 0.5', 8000, '🥤'],
    ['Спрайт 1 литр', 12000, '🥤'], ['Спрайт 0,5 литр', 8000, '🥤'],
    ['FUSY чай 1 литр', 12000, '🧋'], ['FUSY чай 0,5 литр', 8000, '🧋'],
    ['Вода с газом 1 литр', 7000, '💧'], ['Вода с газом 0,5 литр', 5000, '💧'],
    ['Вода без газа 1 литр', 7000, '💧'], ['Вода без газа 0,5 литр', 5000, '💧']
  ],
  combo: [
    ['Vibe Burger Combo', 35000, '🍟'], ['Vibe Chicken Combo', 30000, '🍟'],
    ['Гамбургер Дуо', 60000, '🍟'], ['HOT Dog Family', 105000, '🍟'],
    ['Бургер Family', 105000, '🍟'], ['Клаб сендвич', 40000, '🍟']
  ],
  sauce: [
    ['Кетчуп', 2000, '🥫'], ['Майонез', 2000, '🥫'],
    ['Сырный', 2000, '🥫'], ['Чесночный', 2000, '🥫']
  ]
};

const cats = [
  ['hotdog', '🌭 Хот-доги'], ['burger', '🍔 Бургеры'],
  ['sandwich', '🥪 Сэндвич'], ['fries', '🍟 Фри'],
  ['drinks', '🥤 Напитки'], ['combo', '🍟 Комбо'], ['sauce', '🥫 Соусы']
];

const DELIVERY_FEE = 10000;
let cart = [];
let customerLocation = null;
const money = n => Number(n || 0).toLocaleString('ru-RU') + ' сум';

function getItemsTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}
function getDeliveryFee() {
  return document.querySelector('input[name="type"]:checked')?.value === 'delivery' ? DELIVERY_FEE : 0;
}
function renderCats() {
  document.getElementById('categories').innerHTML = cats.map((cat, index) => `
    <button class="${index === 0 ? 'active' : ''}" onclick="showCat('${cat[0]}', this)">${cat[1]}</button>
  `).join('');
}
function showCat(key, btn) {
  document.querySelectorAll('.cats button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('menu').innerHTML = `<div class="grid">
    ${menu[key].map((item, index) => `<article class="card">
      <div class="emoji">${item[2]}</div><h3>${item[0]}</h3>
      <div class="price">${money(item[1])}</div>
      <button class="add" onclick="addToCart('${key}', ${index})">ДОБАВИТЬ</button>
    </article>`).join('')}
  </div>`;
}
function addToCart(key, index) {
  const item = menu[key][index];
  const existing = cart.find(x => x.name === item[0]);
  if (existing) existing.qty += 1;
  else cart.push({name: item[0], price: item[1], qty: 1});
  updateCart();
}
function changeQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateCart();
}
function updateCart() {
  const itemsTotal = getItemsTotal();
  const deliveryFee = getDeliveryFee();
  const grandTotal = itemsTotal + deliveryFee;
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = money(grandTotal);
  document.getElementById('sumItems').textContent = money(itemsTotal);
  document.getElementById('deliveryCost').textContent = deliveryFee ? money(deliveryFee) : '0 сум';
  document.getElementById('grandTotal').textContent = money(grandTotal);
  const floating = document.getElementById('floatingCart');
  if (floating) floating.style.display = cart.length ? 'flex' : 'none';
  const cartItems = document.getElementById('cartItems');
  if (!cart.length) {
    cartItems.innerHTML = '<p class="muted">Корзина пуста.</p>';
    return;
  }
  cartItems.innerHTML = cart.map((item, index) => `<div class="cart-row">
    <div><h4>${item.name}</h4><div class="muted">${money(item.price)} × ${item.qty}</div></div>
    <div class="qty"><button onclick="changeQty(${index}, -1)">−</button><span>${item.qty}</span><button onclick="changeQty(${index}, 1)">+</button></div>
  </div>`).join('');
}
function openCart() {
  const overlay = document.getElementById('overlay');
  if (overlay) { overlay.classList.add('open'); updateCart(); }
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
    customerLocation = {latitude: position.coords.latitude, longitude: position.coords.longitude};
    note.textContent = '✅ Локация определена. Координаты будут отправлены вместе с заказом.';
  }, error => {
    customerLocation = null;
    if (error.code === 1) note.textContent = 'Разрешите доступ к геолокации в браузере.';
    else if (error.code === 2) note.textContent = 'Не удалось определить локацию.';
    else note.textContent = 'Время ожидания геолокации истекло.';
  }, {enableHighAccuracy: true, timeout: 15000, maximumAge: 0});
}

document.getElementById('orderForm').addEventListener('submit', async event => {
  event.preventDefault();
  if (!cart.length) { document.getElementById('formNote').textContent = 'Добавьте товары в корзину.'; return; }
  const form = new FormData(event.target);
  const items = cart.map(item => ({name: item.name, qty: item.qty, price: item.price}));
  const itemsTotal = getItemsTotal();
  const deliveryFee = getDeliveryFee();
  const total = itemsTotal + deliveryFee;
  const payload = {
    name: form.get('name'), phone: form.get('phone'), address: form.get('address'),
    type: form.get('type'), payment: form.get('payment'), comment: form.get('comment'),
    items, itemsTotal, deliveryFee, total,
    latitude: customerLocation ? customerLocation.latitude : null,
    longitude: customerLocation ? customerLocation.longitude : null
  };
  const note = document.getElementById('formNote');
  note.textContent = 'Отправляем заказ…';
  try {
    const response = await fetch('/api/order', {
      method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Order failed');
    note.textContent = 'Заказ принят! Скоро с вами свяжутся.';
    cart = [];
    customerLocation = null;
    event.target.reset();
    updateCart();
  } catch (error) {
    console.error(error);
    note.textContent = 'Не удалось отправить. Проверьте соединение и попробуйте ещё раз.';
  }
});

document.querySelectorAll('input[name="type"]').forEach(radio => radio.addEventListener('change', updateCart));
renderCats();
showCat('hotdog', document.querySelector('.cats button'));
updateCart();
