// main.js - interactivity for Lar dos Peludos
document.addEventListener('DOMContentLoaded', ()=>{

  // 1) Menu toggle (mobile)
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if(menuToggle && nav){
    menuToggle.addEventListener('click', ()=> nav.classList.toggle('show'));
    document.querySelectorAll('.main-nav a').forEach(a=> a.addEventListener('click', ()=> nav.classList.remove('show')));
  }

  // 2) Carousel (simple)
  (function(){
    const track = document.querySelector('.carousel-track');
    if(!track) return;
    const prev = document.querySelector('.carousel-btn.prev');
    const next = document.querySelector('.carousel-btn.next');
    let index = 0;
    const items = track.querySelectorAll('.carousel-item');
    function show(i){
      index = (i+items.length)%items.length;
      track.style.transform = `translateX(-${index * (items[0].offsetWidth + 12)}px)`;
    }
    prev?.addEventListener('click', ()=> show(index-1));
    next?.addEventListener('click', ()=> show(index+1));
    window.addEventListener('resize', ()=> show(index));
  })();

  // 3) Animals list + search + filter + "adopt" action
  const animals = [
    {id:1,name:'Mingau',type:'gato',age:'2 anos',img:'/assets/images/pet_6.jpg',desc:'Carinhoso e brincalhão'},
    {id:2,name:'Luna',type:'cachorro',age:'1 ano',img:'/assets/images/pet_7.jpg',desc:'Energia e amor'},
    {id:3,name:'Thor',type:'cachorro',age:'3 anos',img:'/assets/images/pet_8.jpg',desc:'Companheiro fiel'},
    {id:4,name:'Nina',type:'gato',age:'4 anos',img:'/assets/images/pet_11.jpg',desc:'Tranquila e dócil'},
    {id:5,name:'Rex',type:'cachorro',age:'2 anos',img:'/assets/images/pet_12.jpg',desc:'Adora passeios'},
    {id:6,name:'Bola',type:'gato',age:'6 meses',img:'/assets/images/pet_13.jpg',desc:'Curioso e meigo'}
  ];

  const grid = document.getElementById('animalsGrid');
  const searchInput = document.getElementById('searchInput');
  const filterType = document.getElementById('filterType');

  function renderAnimals(list){
    if(!grid) return;
    grid.innerHTML = '';
    list.forEach(a=>{
      const card = document.createElement('div');
      card.className = 'animal-card';
      card.innerHTML = `<img src="${a.img}" alt="${a.name}"><h4>${a.name} <small>(${a.type})</small></h4><p>${a.desc}</p><button class="btn adopt" data-id="${a.id}">Quero adotar</button>`;
      grid.appendChild(card);
    });
    document.querySelectorAll('.btn.adopt').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-id');
        localStorage.setItem('adopt_request', id);
        alert('Obrigado! Sua solicitação foi registrada localmente.');
      });
    });
  }
  renderAnimals(animals);

  if(searchInput){
    searchInput.addEventListener('input', ()=> {
      const q = searchInput.value.toLowerCase();
      const type = filterType?.value || '';
      const filtered = animals.filter(a=>{
        return (a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q)) && (type? a.type===type : true);
      });
      renderAnimals(filtered);
    });
  }
  if(filterType){
    filterType.addEventListener('change', ()=> {
      searchInput?.dispatchEvent(new Event('input'));
    });
  }

  // 4) Accordion (if present)
  document.querySelectorAll('.accordion-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      btn.classList.toggle('active');
      const panel = btn.nextElementSibling;
      if(!panel) return;
      if(panel.style.maxHeight) { panel.style.maxHeight = null; }
      else { panel.style.maxHeight = panel.scrollHeight + 'px'; }
    });
  });

  // 5) Contact form -> POST to serverless API /api/submit
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();
      const feedback = document.getElementById('contactFeedback');
      if(!name || !email || !message){ feedback.textContent='Preencha os campos obrigatórios'; feedback.style.color='red'; return;}
      try{
        const res = await fetch('/api/submit', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name,email,phone,message})});
        const j = await res.json();
        if(res.ok){ feedback.textContent='Mensagem enviada com sucesso!'; feedback.style.color='green'; contactForm.reset(); }
        else{ feedback.textContent='Erro ao enviar: '+(j.error || ''); feedback.style.color='red'; }
      }catch(err){
        feedback.textContent='Erro de rede.'; feedback.style.color='red';
      }
    });
  }

  // 6) Login demo
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit',(e)=>{
      e.preventDefault();
      const em = document.getElementById('emailLogin').value;
      const pw = document.getElementById('pwdLogin').value;
      const msg = document.getElementById('loginMsg');
      if(em==='usuario@teste.com' && pw==='senha123'){
        msg.textContent='Login bem-sucedido'; msg.style.color='green';
        setTimeout(()=> window.location.href='/', 800);
      } else { msg.textContent='Credenciais inválidas'; msg.style.color='red'; }
    });
  }

  // 7) Theme (localStorage, placeholder)
  const themeKey = 'ldp_theme';
  if(localStorage.getItem(themeKey)==='dark'){
    document.documentElement.classList.add('dark');
  }

  // 8) Back to top button
  const backBtn = document.createElement('button');
  backBtn.className = 'back-to-top';
  backBtn.textContent = '▲';
  document.body.appendChild(backBtn);
  backBtn.style.cssText='position:fixed;right:16px;bottom:16px;padding:10px;border-radius:8px;border:none;background:#6a0dad;color:#fff;display:none;cursor:pointer';
  backBtn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
  window.addEventListener('scroll', ()=> { backBtn.style.display = window.scrollY>300 ? 'block' : 'none'; });

  // 9) Lazy load images
  document.querySelectorAll('img').forEach(img=> { img.loading = 'lazy'; });

  // 10) Analytics local (visits)
  let visits = Number(localStorage.getItem('ldp_visits')||0);
  visits++;
  localStorage.setItem('ldp_visits', visits);

});
