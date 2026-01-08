// Minimal frontend logic: fetch products from API or fallback to local sample,
// render products, category filters, search, cart (localStorage), and checkout stub.

const API = "/api/products"; // server endpoint (see server.js). If not present, fallback.

let products = [];
let visible = 6;
let cart = JSON.parse(localStorage.getItem('cart')||'{}');

function updateCartCount(){
  const count = Object.values(cart).reduce((s,n)=>s+n,0);
  document.getElementById('cart-count').textContent = count;
}
function saveCart(){ localStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); renderCartItems(); }

async function loadProducts(){
  try {
    const res = await fetch(API);
    if(!res.ok) throw new Error('no api');
    products = await res.json();
  } catch(e){
    // fallback sample
    products = [
      {"id":1,"title":"Engine Oil Filter","price":35,"category":"Engine","img":"https://i.pinimg.com/1200x/52/f8/c4/52f8c45aed27e6f0771038d9d02bbcab.jpg"},
      {"id":2,"title":"Front Brake Pad Set","price":50,"category":"Brakes","img":"https://picsum.photos/seed/brake/800/600"},
      {"id":3,"title":"Car Battery 12V","price":120,"category":"Electrical","img":"https://picsum.photos/seed/battery/800/600"},
      {"id":4,"title":"LED Headlight Assembly","price":90,"category":"Lighting","img":"https://picsum.photos/seed/lights/800/600"},
      {"id":5,"title":"Air Intake Filter","price":25,"category":"Engine","img":"https://picsum.photos/seed/air/800/600"},
      {"id":6,"title":"Spark Plug Set","price":18,"category":"Engine","img":"https://picsum.photos/seed/spark/800/600"},
      {"id":7,"title":"Oil Pump","price":230,"category":"Engine","img":"https://picsum.photos/seed/pump/800/600"},
      {"id":8,"title":"Tail Light","price":45,"category":"Lighting","img":"https://picsum.photos/seed/taillight/800/600"}
    ];
  }
  renderCategories();
  renderProducts();
  updateCartCount();
}

function renderCategories(){
  const cats = Array.from(new Set(products.map(p=>p.category)));
  const wrap = document.getElementById('category-list');
  wrap.innerHTML = '';
  const allBtn = document.createElement('button');
  allBtn.textContent = 'All';
  allBtn.onclick = ()=>{ filterCategory(null); };
  wrap.appendChild(allBtn);
  cats.forEach(c=>{
    const b = document.createElement('button');
    b.textContent = c;
    b.onclick = ()=>filterCategory(c);
    wrap.appendChild(b);
  });
}

let activeCategory = null;
function filterCategory(cat){
  activeCategory = cat;
  visible = 6;
  renderProducts();
}

function renderProducts(){
  const grid = document.getElementById('products');
  let list = products.slice();
  if(activeCategory) list = list.filter(p=>p.category===activeCategory);
  const q = document.getElementById('search').value.trim().toLowerCase();
  if(q) list = list.filter(p=>p.title.toLowerCase().includes(q));
  const sort = document.getElementById('sort').value;
  if(sort==="price-asc") list.sort((a,b)=>a.price-b.price);
  if(sort==="price-desc") list.sort((a,b)=>b.price-a.price);
  grid.innerHTML = '';
  list.slice(0,visible).forEach(p=>{
    const c = document.createElement('div'); c.className='card';
    c.innerHTML = `<img src="${p.img}" alt="${p.title}"><h4>${p.title}</h4><p class="price">$${p.price}</p><div style="display:flex;gap:8px"><button class="btn" data-id="${p.id}">Add</button><button class="btn-outline" data-id="${p.id}" data-wishlist>Wishlist</button></div>`;
    grid.appendChild(c);
  });
  document.getElementById('load-more').style.display = (list.length>visible)?'inline-block':'none';
  // attach add handlers
  document.querySelectorAll('button[data-id]').forEach(b=>{
    b.onclick = (e)=>{
      const id = Number(b.getAttribute('data-id'));
      cart[id] = (cart[id]||0)+1;
      saveCart();
    };
  });
}

document.getElementById('load-more').addEventListener('click', ()=>{
  visible += 6; renderProducts();
});
document.getElementById('search').addEventListener('input', ()=>{ visible=6; renderProducts(); });
document.getElementById('sort').addEventListener('change', renderProducts);
document.getElementById('cart-btn').addEventListener('click', ()=>{ openCart(); });

function openCart(){
  const modal = document.getElementById('cart-modal');
  modal.setAttribute('aria-hidden','false');
}

document.getElementById('close-cart').addEventListener('click', ()=>{
  document.getElementById('cart-modal').setAttribute('aria-hidden','true');
});

function renderCartItems(){
  const wrap = document.getElementById('cart-items');
  if(!wrap) return;
  if(Object.keys(cart).length===0){ wrap.innerHTML = '<p>Your cart is empty</p>'; document.getElementById('cart-total').textContent='0'; return; }
  let html = '<ul>';
  let total = 0;
  for(const [id,qty] of Object.entries(cart)){
    const prod = products.find(p=>p.id==id);
    if(!prod) continue;
    html += `<li style="margin-bottom:8px"><strong>${prod.title}</strong> x ${qty} — $${prod.price*qty} <button data-rem="${id}" class="btn-outline">Remove</button></li>`;
    total += prod.price*qty;
  }
  html += '</ul>';
  wrap.innerHTML = html;
  document.getElementById('cart-total').textContent = total;
  // remove buttons
  document.querySelectorAll('button[data-rem]').forEach(b=>{
    b.onclick = ()=>{
      const id = b.getAttribute('data-rem');
      delete cart[id]; saveCart();
    };
  });
}

document.getElementById('checkout').addEventListener('click', ()=>{
  alert('Checkout is a demo. In production integrate with payment gateway and backend order API.');
});

// newsletter
document.getElementById('subscribe').addEventListener('click', ()=>{
  const email = document.getElementById('newsletter-email').value.trim();
  if(!email) return alert('Enter your email');
  alert('Thanks — subscription saved (demo).');
});

// init
loadProducts();
renderCartItems();
