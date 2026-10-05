const menu = {
  hotdog: [
    ['1 сосиска', 10000, '🌭'],
    ['2 сосиски', 15000, '🌭'],
    ['3 сосиски', 18000, '🌭'],
    ['4 сосиски', 20000, '🌭'],
    ['Shashlik 1 Sosisa + 1 Shashlik', 24000, '🌭'],
    ['Shashlik 2 Sosisa + 1 Shashlik', 28000, '🌭'],
    ['Shashlik 2 Sosisa + 2 Shashlik', 35000, '🌭'],
    ['Kotletli', 32000, '🌭'],
    ['Big Kotlet', 45000, '🌭'],
    ['Tovuqli', 25000, '🌭'],
    ['Qazi', 25000, '🌭'],
    ['Katta Qazi', 35000, '🌭']
  ],
  burger: [
    ['Gamburger', 20000, '🍔'],
    ['Cheeseburger', 25000, '🍔'],
    ['Double Burger', 35000, '🍔'],
    ['Double Cheese', 40000, '🍔'],
    ['VIBE Burger', 25000, '🍔'],
    ['VIBE Burger Chicken', 20000, '🍔']
  ],
  sandwich: [
    ['Club Sandwich', 35000, '🥪']
  ],
  drinks: [
    ['Фанта 1 литр', 12000, '🥤'],
    ['Фанта 0.5', 8000, '🥤'],
    ['Фанта 250 мл', 5000, '🥤'],
    ['Кола 1 литр', 12000, '🥤'],
    ['Кола 0.5', 8000, '🥤'],
    ['Кола 300 мл', 6000, '🥤'],
    ['Кола 250 мл', 5000, '🥤'],
    ['Газсиз сув', 0, '💧']
  ],
  combo: [
    ['Vibe Burger Combo', 35000, '🍟'],
    ['Vibe Chicken Combo', 30000, '🍟'],
    ['Гамбургер Дуо', 60000, '🍟'],
    ['HOT Dog Family', 105000, '🍟'],
    ['Бургер Family', 105000, '🍟'],
    ['Клаб сендвич', 40000, '🍟']
  ],
  sauce: [
    ['Кетчуп', 2000, '🥫'],
    ['Майонез', 2000, '🥫'],
    ['Сырный', 2000, '🥫'],
    ['Чесночный', 2000, '🥫']
  ]
};

const cats = [
  ['hotdog', '🌭 Хот-доги'],
  ['burger', '🍔 Бургеры'],
  ['sandwich', '🥪 Сэндвич'],
  ['drinks', '🥤 Напитки'],
  ['combo', '🍟 Комбо'],
  ['sauce', '🥫 Соусы']
];

let cart = [];
let customerLocation = null;

const money = n =>
  Number(n || 0).toLocaleString('ru-RU') + ' сум';

function renderCats() {
  const el = document.getElementById('categories');

  el.innerHTML = cats.map((cat, index) => `
    <button class="${index === 0 ? 'active' : ''}"
      onclick="showCat('${cat[0]}', this)">
      ${cat[1]}
    </button>
  `).join('');
}

function showCat(key, btn) {
  document.querySelectorAll('.cats button')
    .forEach(b => b.classList.remove('active'));

  if (btn) btn.classList.add('active');

  const menuEl = document.getElementById('menu');

  menuEl.innerHTML = `
    <div class="grid">
      ${menu[key].map((item, index) => `
        <article class="card">
          <div class="emoji">${item[2]}</div>
          <h3>${item[0]}</h3>
          <div class="price">
            ${item[1] ? money(item[1]) : 'Цена уточняется'}
          </div>
          <button class="add"
            onclick="addToCart('${key}', ${index})">
            ДОБАВИТЬ
          </button>
        </article>
      `).join('')}
    </div>
  `;
}

function addToCart(key, index) {
  const item = menu[key][index];
  const name = item[0];
  const price = item[1];

  if (!price) return;

  const existing = cart.find(x => x.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      name,
      price,
      qty: 1
    });
  }

  updateCart();
}

function changeQty(index, delta) {
  if (!cart[index]) return;

  cart[index].qty += delta;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  updateCart();
}

function getCartTotal() {
  return cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
}

function updateCart() {
  const total = getCartTotal();

  const count = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = money(total);
  document.getElementById('sumItems').textContent = money(total);
  document.getElementById('grandTotal').textContent = money(total);

  const delivery = document.getElementById('deliveryCost');
  if (delivery) {
    delivery.textContent = 'Рассчитывается';
  }

  const floating = document.getElementById('floatingCart');
  if (floating) {
    floating.style.display = cart.length ? 'flex' : 'none';
  }

  const cartItems = document.getElementById('cartItems');

  if (!cart.length) {
    cartItems.innerHTML =
      '<p class="muted">Корзина пуста.</p>';
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-row">
      <div>
        <h4>${item.name}</h4>
        <div class="muted">${money(item.price)} × ${item.qty}</div>
      </div>

      <div class="qty">
        <button onclick="changeQty(${index}, -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${index}, 1)">+</button>
      </div>
    </div>
  `).join('');
}

function openCart() {
  const overlay = document.getElementById('overlay');

  if (overlay) {
    overlay.classList.add('open');
    updateCart();
  }
}

function closeCart(event) {
  const overlay = document.getElementById('overlay');

  if (!overlay) return;

  if (!event || event.target === overlay) {
    overlay.classList.remove('open');
  }
}

function getLocation() {
  const note = document.getElementById('locationNote');

  if (!navigator.geolocation) {
    note.textContent =
      'Геолокация не поддерживается вашим браузером.';
    return;
  }

  note.textContent =
    'Определяем вашу локацию…';

  navigator.geolocation.getCurrentPosition(
    position => {
      customerLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      note.textContent =
        '✅ Локация определена. Координаты будут отправлены вместе с заказом.';
    },
    error => {
      customerLocation = null;

      if (error.code === 1) {
        note.textContent =
          'Разрешите доступ к геолокации в браузере.';
      } else if (error.code === 2) {
        note.textContent =
          'Не удалось определить локацию.';
      } else {
        note.textContent =
          'Время ожидания геолокации истекло.';
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }
  );
}

document.getElementById('orderForm')
  .addEventListener('submit', async event => {
    event.preventDefault();

    if (!cart.length) {
      document.getElementById('formNote').textContent =
        'Добавьте товары в корзину.';
      return;
    }

    const form = new FormData(event.target);

    const items = cart.map(item => ({
      name: item.name,
      qty: item.qty,
      price: item.price
    }));

    const total = getCartTotal();

    const payload = {
      name: form.get('name'),
      phone: form.get('phone'),
      address: form.get('address'),
      type: form.get('type'),
      payment: form.get('payment'),
      comment: form.get('comment'),
      items,
      total,
      latitude: customerLocation
        ? customerLocation.latitude
        : null,
      longitude: customerLocation
        ? customerLocation.longitude
        : null
    };

    const note = document.getElementById('formNote');

    note.textContent =
      'Отправляем заказ…';

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Order failed');
      }

      note.textContent =
        'Заказ принят! Скоро с вами свяжутся.';

      cart = [];
      customerLocation = null;

      updateCart();
      event.target.reset();

    } catch (error) {
      console.error(error);

      note.textContent =
        'Не удалось отправить. Проверьте соединение и попробуйте ещё раз.';
    }
  });

renderCats();
showCat(
  'hotdog',
  document.querySelector('.cats button')
);
updateCart();
