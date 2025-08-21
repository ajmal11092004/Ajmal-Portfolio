// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
toggle.addEventListener('click', () => navList.classList.toggle('open'));

// Active link on scroll
const links = [...document.querySelectorAll('.nav-link')];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#'+e.target.id));
    }
  });
},{ rootMargin: '-40% 0px -50% 0px', threshold: 0.0 });
sections.forEach(s => s && io.observe(s));

// Fade-in on view
const faders = document.querySelectorAll('.fade-in');
const io2 = new IntersectionObserver(es => es.forEach(e=>{
  if(e.isIntersecting){ e.target.classList.add('show'); io2.unobserve(e.target); }
}),{threshold:.15});
faders.forEach(el => io2.observe(el));

// Modals
document.querySelectorAll('.modal-open').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.getElementById(btn.dataset.modal).classList.add('show');
  });
});
document.querySelectorAll('.modal').forEach(m=>{
  m.addEventListener('click', e=>{
    if(e.target.classList.contains('modal') || e.target.classList.contains('modal-close')){
      m.classList.remove('show');
    }
  });
});

// Subtle white-theme particle field (stars) that gently repel from mouse
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, mouse = {x:-9999,y:-9999}, stars=[];

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  // rebuild particles for crisp density
  const count = Math.min(160, Math.floor((W*H)/16000));
  stars = new Array(count).fill(0).map(()=>({
    x: Math.random()*W,
    y: Math.random()*H,
    r: Math.random()*1.6 + 0.4,
    vx: (Math.random()-0.5)*0.2,
    vy: (Math.random()-0.5)*0.2
  }));
}
resize();
window.addEventListener('resize', resize);
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

function tick(){
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = 'rgba(0,0,0,0.08)';     // soft grey dots on white
  ctx.strokeStyle = 'rgba(0,0,0,0.06)';

  for (let s of stars){
    // gentle move
    s.x += s.vx; s.y += s.vy;

    // mouse repel
    const dx = s.x - mouse.x, dy = s.y - mouse.y;
    const d2 = dx*dx + dy*dy;
    if (d2 < 140*140){
      const f = 0.35 / Math.max(40, Math.sqrt(d2));
      s.vx += dx * f * 0.02;
      s.vy += dy * f * 0.02;
    }

    // wrap
    if (s.x < -10) s.x = W+10; if (s.x > W+10) s.x = -10;
    if (s.y < -10) s.y = H+10; if (s.y > H+10) s.y = -10;

    // draw dot
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
  }

  // occasional faint connections
  for (let i=0;i<stars.length;i++){
    for (let j=i+1;j<i+6 && j<stars.length;j++){
      const a = stars[i], b = stars[j];
      const dx = a.x-b.x, dy = a.y-b.y;
      const d2 = dx*dx+dy*dy;
      if (d2 < 90*90){
        ctx.globalAlpha = 0.08 * (1 - (Math.sqrt(d2)/90));
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
  requestAnimationFrame(tick);
}
tick();
