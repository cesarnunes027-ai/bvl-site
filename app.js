// Dark Gamer frontend logic
const PRODUCTS = [
  { id: 'vip_bronze', name: 'VIP Bronze', desc: 'Benefícios básicos', price: 10.00 },
  { id: 'vip_prata', name: 'VIP Prata', desc: 'Benefícios intermediários', price: 20.00 },
  { id: 'vip_ouro', name: 'VIP Ouro', desc: 'Benefícios avançados', price: 35.00 },
  { id: 'vip_diamante', name: 'VIP Diamante', desc: 'Benefícios máximos', price: 60.00 },
  { id: 'study_pack', name: 'Pacote Estudos', desc: 'XP + bônus', price: 8.00 },
  { id: 'level_pack', name: 'Level +5', desc: 'Sobe níveis instantaneamente', price: 12.00 },
  { id: 'gold_small', name: 'Gold 5k', desc: '5.000 moedas', price: 6.00 },
  { id: 'gold_big', name: 'Gold 20k', desc: '20.000 moedas', price: 20.00 }
];

const productsWrap = document.getElementById('products');
const storeSection = document.getElementById('store');
const panel = document.getElementById('panel');
const playerInfo = document.getElementById('player-info');
const modalLogin = document.getElementById('modal-login');
let currentUser = null;

function renderProducts(){
  productsWrap.innerHTML = '';
  PRODUCTS.forEach(p => {
    const el = document.createElement('div'); el.className='product';
    el.innerHTML = `<h4>${p.name}</h4><p>${p.desc}</p><div class="row"><strong>R$ ${p.price.toFixed(2)}</strong><button data-id="${p.id}" class="btn">Comprar</button></div>`;
    productsWrap.appendChild(el);
  });
}

document.getElementById('open-store').addEventListener('click', ()=>{ storeSection.classList.remove('hidden'); renderProducts(); window.scrollTo({top: storeSection.offsetTop-20, behavior:'smooth'}); });
document.getElementById('open-panel-hero').addEventListener('click', ()=>{ document.getElementById('btn-panel').click(); });

document.getElementById('btn-store').addEventListener('click', ()=>{ storeSection.classList.toggle('hidden'); renderProducts(); });
document.getElementById('btn-panel').addEventListener('click', ()=>{ modalLogin.classList.remove('hidden'); });

productsWrap.addEventListener('click', async (e)=>{
  if(e.target.tagName==='BUTTON'){
    const id = e.target.dataset.id;
    const product = PRODUCTS.find(x=>x.id===id);
    if(!currentUser){ alert('Faça login antes de comprar.'); return; }
    try{
      const res = await fetch('/api/create_preference', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ product, userId: currentUser.id })
      });
      const json = await res.json();
      if(json.init_point) window.location.href = json.init_point;
      else alert('Erro ao criar preferência');
    }catch(err){ console.error(err); alert('Erro de rede'); }
  }
});

// Login modal behavior
document.getElementById('btn-close-login').addEventListener('click', ()=> modalLogin.classList.add('hidden'));
document.getElementById('btn-login-submit').addEventListener('click', async ()=>{
  const nick = document.getElementById('nick').value.trim();
  const pass = document.getElementById('password').value;
  if(!nick || !pass){ alert('Preencha nick e senha'); return; }
  try{
    const res = await fetch('/api/auth', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ nick, pass })});
    const data = await res.json();
    if(data.ok){ currentUser = { nick: data.nick, id: data.id }; modalLogin.classList.add('hidden'); updatePanel(); }
    else alert('Erro: '+(data.error||'desconhecido'));
  }catch(err){ console.error(err); alert('Erro de rede'); }
});

async function updatePanel(){
  if(!currentUser){ playerInfo.innerHTML = '<p>Você não está logado.</p>'; return; }
  try{
    const res = await fetch('/api/userdata?userId='+encodeURIComponent(currentUser.id));
    const d = await res.json();
    playerInfo.innerHTML = `<p><strong>Nick:</strong> ${currentUser.nick}</p><p><strong>Level:</strong> ${d.level||0}</p><p><strong>Coins:</strong> ${d.coins||0}</p><p><strong>VIP:</strong> ${d.vip||'Nenhum'}</p>`;
    panel.classList.remove('hidden');
  }catch(e){
    playerInfo.innerHTML = '<p>Erro ao buscar dados.</p>';
  }
}

// initial
renderProducts();
