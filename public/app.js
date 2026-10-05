const menu = {
  hotdog: [
    ['1 сосиска', 10000], ['2 сосиски', 15000], ['3 сосиски', 18000], ['4 сосиски', 20000],
    ['Shashlik 1 Sosisa + 1 Shashlik', 24000], ['Shashlik 2 Sosisa + 1 Shashlik', 28000],
    ['Shashlik 2 Sosisa + 2 Shashlik', 35000], ['Kotletli', 32000], ['Big Kotlet', 45000],
    ['Tovuqli', 25000], ['Qazi', 25000], ['Katta Qazi', 35000]
  ],
  burger: [
    ['Gamburger', 20000], ['Cheeseburger', 25000], ['Double Burger', 35000],
    ['Double Cheese', 40000], ['VIBE Burger', 25000], ['VIBE Burger Chicken', 20000]
  ],
  sandwich: [['Club Sandwich', 35000]],
  drinks: [
    ['Фанта 1 литр', 12000], ['Фанта 0.5', 8000], ['Фанта 250 мл', 5000],
    ['Кола 1 литр', 12000], ['Кола 0.5', 8000], ['Кола 300 мл', 6000],
    ['Кола 250 мл', 5000], ['Газсиз сув', 0]
  ],
  combo: [
    ['Vibe Burger Combo', 35000], ['Vibe Chicken Combo', 30000], ['Гамбургер Дуо', 60000],
    ['HOT Dog Family', 105000], ['Бургер Family', 105000], ['Клаб сендвич', 40000]
  ],
  sauce: [['Кетчуп', 2000], ['Майонез', 2000], ['Сырный', 2000], ['Чесночный', 2000]]
};

const cats = [
  ['hotdog', '🌭 Хот-доги'], ['burger', '🍔 Бургеры'], ['sandwich', '🥪 Сэндвич'],
  ['drinks', '🥤 Напитки'], ['combo', '🍟 Комбо'], ['sauce', '🥫 Соусы']
];

const DELIVERY_FEE = 10000;
let cart = [];
let customerLocation = null;

const money = n => Number(n || 0).toLocaleString('ru-RU') + ' сум';

function getItemsTotal() {
  return cart.reduce((sum, x) => sum + x.qty * x.price, 0);
}

function getDeliveryFee() {
  const type = document.querySelector('input[name="type"]:checked')?.value;
  return type === 'delivery' ? DELIVERY_FEE : 0;
}

function renderCats() {
  document.getElementById('categories').innerHTML = cats.map((c, i) =>
    `<button class="${i === 0 ? 'active' : ''}" onclick="showCat('${c[0]}', this)">${c[1]}</button>`
  ).join('');
}

function showCat(key, btn) {
  document.querySelectorAll('.cats button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  document.getElementById('menu').innerHTML = menu[key].map((x, i) => `
    <article class="product">
      <div class="product-info">
        <h3>${x[0]}</h3>
        <b>${x[1] ? money(x[1]) : 'Цена уточняется'}</b>
      </div>
      <button onclick="addToCart('${key}', ${i})">+</button>
    </article>
  `).join('');
}

function addToCart(key, index) {
  const [name, price] = menu[key][index];
  if (!price) return;

  const item = cart.find(x => x.name === name);
  if (item) item.qty++;
  else cart.push({ name, price, qty: 1 });

  updateCart();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  const itemsTotal = getItemsTotal();
  const deliveryFee = getDeliveryFee();
  const grandTotal = itemsTotal + deliveryFee;

  document.getElementById('cartCount').textContent =
    cart.reduce((sum, x) => sum + x.qty, 0);

  document.getElementById('cartTotal').textContent = money(grandTotal);
  document.getElementById('sumItems').textContent = money(itemsTotal);
  document.getElementById('deliveryCost').textContent =
    deliveryFee ? money(deliveryFee) : '0 сум';
  document.getElementById('grandTotal').textContent = money(grandTotal);

  document.getElementById('floatingCart').style.display =
    cart.length ? 'flex' : 'none';

  document.getElementById('cartItems').innerHTML = cart.length
    ? cart.map((x, i) => `
      <div class="cart-item">
        <div><b>${x.name}</b><small>${money(x.price)}</small></div>
        <div class="qty">
          <button onclick="changeQty(${i}, -1)">−</button>
          <span>${x.qty}</span>
          <button onclick="changeQty(${i}, 1)">+</button>
        </div>
      </div>
    `).join('')
    : '<p class="empty">Корзина пуста.</p>';
}

function openCart() {
  document.getElementById('overlay').classList.add('show');
  updateCart();
}

function closeCart(e) {
  if (!e || e.target === document.getElementById('overlay')) {
    document.getElementById('overlay').classList.remove('show');
  }
}

function getLocation() {
  const note = document.getElementById('locationNote');

  if (!navigator.geolocation) {
    note.textContent = 'Геолокация не поддерживается вашим браузером.';
    return;
  }

  note.textContent = 'Определяем вашу локацию…';

  navigator.geolocation.getCurrentPosition(
    position => {
      customerLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      note.textContent = '✅ Локация определена. Координаты будут отправлены вместе с заказом.';
    },
    error => {
      customerLocation = null;
      if (error.code === 1) note.textContent = 'Разрешите доступ к геолокации в браузере.';
      else if (error.code === 2) note.textContent = 'Не удалось определить локацию.';
      else note.textContent = 'Время ожидания геолокации истекло.';
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }
  );
}

document.getElementById('orderForm').addEventListener('submit', async e => {
  e.preventDefault();

  if (!cart.length) {
    document.getElementById('formNote').textContent = 'Добавьте товары в корзину.';
    return;
  }

  const f = new FormData(e.target);
  const items = cart.map(x => ({
    name: x.name,
    qty: x.qty,
    price: x.price
  }));

  const itemsTotal = getItemsTotal();
  const deliveryFee = getDeliveryFee();
  const total = itemsTotal + deliveryFee;

  const payload = {
    name: f.get('name'),
    phone: f.get('phone'),
    address: f.get('address'),
    type: f.get('type'),
    payment: f.get('payment'),
    comment: f.get('comment'),
    items,
    itemsTotal,
    deliveryFee,
    total,
    latitude: customerLocation ? customerLocation.latitude : null,
    longitude: customerLocation ? customerLocation.longitude : null
  };

  const note = document.getElementById('formNote');
  note.textContent = 'Отправляем заказ…';

  try {
    const r = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!r.ok) throw new Error();

    note.textContent = 'Заказ принят! Скоро с вами свяжутся.';
    cart = [];
    customerLocation = null;
    document.getElementById('locationNote').textContent = '';
    updateCart();
    e.target.reset();
    updateCart();
  } catch (err) {
    note.textContent = 'Не удалось отправить. Проверьте соединение и попробуйте ещё раз.';
  }
});

document.querySelectorAll('input[name="type"]').forEach(radio => {
  radio.addEventListener('change', updateCart);
});

renderCats();
showCat('hotdog', document.querySelector('.cats button'));
updateCart();


