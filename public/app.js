const menu = [
  {cat:"hotdog", title:"Хот-доги", items:[
    ["1 сосиска","10 000", "🌭"],["2 сосиски","15 000","🌭"],["3 сосиски","18 000","🌭"],["4 сосиски","20 000","🌭"],
    ["Shashlik 1 Sosisa + 1 Shashlik","24 000","🔥"],["Shashlik 2 Sosisa + 1 Shashlik","28 000","🔥"],
    ["Shashlik 2 Sosisa + 2 Shashlik","35 000","🔥"],["Kotletli","32 000","🌭"],["Big Kotlet","45 000","🌭"],
    ["Tovuqli","25 000","🌭"],["Qazi","25 000","🌭"],["Katta Qazi","35 000","🌭"]
  ]},
  {cat:"burger", title:"Бургеры", items:[
    ["Gamburger","20 000","🍔"],["Cheeseburger","25 000","🍔"],["Double Burger","35 000","🍔"],
    ["Double Cheese","40 000","🍔"],["VIBE Burger","25 000","🍔"],["VIBE Burger Chicken","20 000","🍔"]
  ]},
  {cat:"sandwich", title:"Сэндвичи", items:[["Club Sandwich","35 000","🥪"]]},
  {cat:"drinks", title:"Напитки", items:[
    ["Фанта 1 литр","12 000","🥤"],["Фанта 0.5","8 000","🥤"],["Фанта 250 мл","5 000","🥤"],
    ["Кола 1 литр","12 000","🥤"],["Кола 0.5","8 000","🥤"],["Кола 300 мл","6 000","🥤"],["Кола 250 мл","5 000","🥤"],["Газсиз сув","—","💧"]
  ]},
  {cat:"combo", title:"Комбо", items:[
    ["Vibe Burger Combo","35 000","🍔"],["Vibe Chicken Combo","30 000","🍗"],["Гамбургер Дуо","60 000","🍔"],
    ["HOT Dog Family","105 000","🌭"],["Бургер Family","105 000","🍔"],["Клаб сендвич","40 000","🥪"]
  ]},
  {cat:"sauce", title:"Соусы", items:[["Кетчуп","2 000","🥫"],["Майонез","2 000","🥫"],["Сырный","2 000","🥫"],["Чесночный","2 000","🥫"]]}
];
const cats=[...menu.map(x=>[x.cat,x.title])];
let cart=[];
const money=n=>new Intl.NumberFormat('ru-RU').format(n)+" сум";
const num=s=>parseInt(String(s).replace(/\s/g,''))||0;

function renderCats(){
  document.getElementById('categories').innerHTML=cats.map(([id,t],i)=>`<button class="${i===0?'active':''}" onclick="showCat('${id}',this)">${t}</button>`).join('');
}
function showCat(id,btn){
  document.querySelectorAll('.cats button').forEach(x=>x.classList.remove('active')); btn.classList.add('active');
  const section=menu.find(x=>x.cat===id);
  document.getElementById('menu').innerHTML=`<h2 class="section-title">${section.title} <span>•</span></h2><div class="grid">${section.items.map((it,i)=>`
    <article class="card"><div class="emoji">${it[2]}</div><h3>${it[0]}</h3><div class="desc">${id==='combo'?'Выгодный набор VIBE':id==='sauce'?'Добавка к заказу':'Свежо и горячо'}</div><div class="price">${it[1]} сум</div><button class="add" onclick="addItem('${section.cat}',${i})">+ ДОБАВИТЬ</button></article>`).join('')}</div>`;
}
function addItem(cat,index){
  const s=menu.find(x=>x.cat===cat), it=s.items[index];
  const key=cat+'-'+index; const old=cart.find(x=>x.key===key);
  if(old) old.qty++; else cart.push({key,cat,index,name:it[0],price:num(it[1]),qty:1});
  updateCart();
}
function change(key,d){
  const x=cart.find(x=>x.key===key); if(!x)return; x.qty+=d;
  if(x.qty<=0) cart=cart.filter(x=>x.key!==key); updateCart();
}
function updateCart(){
  const count=cart.reduce((a,x)=>a+x.qty,0), total=cart.reduce((a,x)=>a+x.qty*x.price,0);
  document.getElementById('cartCount').textContent=count;
  document.getElementById('cartTotal').textContent=money(total);
  document.getElementById('sumItems').textContent=money(total);
  document.getElementById('grandTotal').textContent=money(total);
  document.getElementById('cartItems').innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><div><h4>${x.name}</h4><div class="muted">${money(x.price)} × ${x.qty}</div></div><div class="qty"><button onclick="change('${x.key}',-1)">−</button><b>${x.qty}</b><button onclick="change('${x.key}',1)">+</button></div></div>`).join(''):`<p class="muted">Корзина пока пустая.</p>`;
}
function openCart(){document.getElementById('overlay').classList.add('open');}
function closeCart(e){if(!e||e.target.id==='overlay')document.getElementById('overlay').classList.remove('open');}

document.getElementById('orderForm').addEventListener('submit',async e=>{
  e.preventDefault();
  if(!cart.length){document.getElementById('formNote').textContent='Добавьте товары в корзину.';return;}
  const f=new FormData(e.target), items=cart.map(x=>({name:x.name,qty:x.qty,price:x.price}));
  const payload={name:f.get('name'),phone:f.get('phone'),address:f.get('address'),type:f.get('type'),payment:f.get('payment'),comment:f.get('comment'),items,total:cart.reduce((a,x)=>a+x.qty*x.price,0)};
  const note=document.getElementById('formNote'); note.textContent='Отправляем заказ…';
  try{
    const r=await fetch('/api/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    if(!r.ok) throw new Error();
    note.textContent='Заказ принят! Скоро с вами свяжутся.';
    cart=[]; updateCart(); e.target.reset();
  }catch(err){note.textContent='Не удалось отправить. Проверьте соединение и попробуйте ещё раз.';}
});
renderCats(); showCat('hotdog',document.querySelector('.cats button')); updateCart();
// ===== СОХРАНЕНИЕ ДАННЫХ КЛИЕНТА =====

