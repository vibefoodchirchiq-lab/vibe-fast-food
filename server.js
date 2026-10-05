const express=require('express');
const path=require('path');
const dotenv=require('dotenv');
dotenv.config();
const app=express();
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

app.post('/api/order',async(req,res)=>{
  const {name,phone,address,type,payment,comment,items,total}=req.body||{};
  if(!name||!phone||!address||!items?.length) return res.status(400).json({error:'Заполните данные заказа'});
  const token=process.env.TELEGRAM_BOT_TOKEN;
  const chatId=process.env.TELEGRAM_CHAT_ID;
  if(!token||!chatId) return res.status(500).json({error:'Telegram не настроен'});
  const lines=items.map(x=>`• ${x.name} × ${x.qty} — ${Number(x.price*x.qty).toLocaleString('ru-RU')} сум`).join('\n');
  const text=`🔥 НОВЫЙ ЗАКАЗ VIBE\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n📍 Адрес: ${address}\n🚚 Тип: ${type==='delivery'?'Доставка':'Самовывоз'}\n💳 Оплата: ${payment==='cash'?'Наличными':'Картой'}\n\n${lines}\n\n💰 ИТОГО: ${Number(total).toLocaleString('ru-RU')} сум${comment?`\n\n💬 Комментарий: ${comment}`:''}`;
  const tg=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chatId,text})});
  const data=await tg.json();
  if(!data.ok) return res.status(502).json({error:'Telegram error'});
  res.json({ok:true});
});
const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`VIBE site: http://localhost:${port}`));
