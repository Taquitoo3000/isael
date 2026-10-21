// Menú móvil
const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => menu.classList.toggle('active'));

// Marcar página actual
const here = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.boton_menu').forEach(a => {
  if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
});

// Simulación de partículas (dos tipos, como el muro heterogéneo de tu investigación)
(() => {
  const cv = document.createElement('canvas');
  cv.id = 'sim';
  document.body.prepend(cv);
  const ctx = cv.getContext('2d');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mouse = { x: -999, y: -999 };
  let W, H, P = [], dpr = Math.min(devicePixelRatio || 1, 2);

  function resize() {
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(130, Math.floor(W * H / 14000));
    P = Array.from({ length: n }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
      t: i % 3 === 0 ? 1 : 0
    }));
  }
  addEventListener('resize', resize);
  addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });

  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (const p of P) {
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < 22500) { const f = (1 - Math.sqrt(d2) / 150) * .6, d = Math.sqrt(d2) || 1; p.vx += dx / d * f; p.vy += dy / d * f; }
      p.vx *= .985; p.vy *= .985;
      p.x += p.vx + (Math.random() - .5) * .08; p.y += p.vy + (Math.random() - .5) * .08;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    }
    for (let i = 0; i < P.length; i++) {
      const a = P[i];
      for (let j = i + 1; j < P.length; j++) {
        const b = P[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
        if (d < 10000) {
          ctx.strokeStyle = `rgba(127,180,255,${(1 - d / 10000) * .22})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = a.t ? '#f2b660' : '#7fb4ff';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.t ? 2.6 : 1.8, 0, 6.283); ctx.fill();
    }
    if (!still) requestAnimationFrame(frame);
  }
  resize(); frame();
})();

// Secuencia de entrada: solo en el inicio y una vez por sesión
(() => {
  if (!document.querySelector('.imagen_perfil') || sessionStorage.getItem('intro')) return;
  sessionStorage.setItem('intro', '1');
  const el = document.createElement('div');
  el.id = 'intro';
  el.innerHTML = '<div><h1>Isael Aaron Segoviano Caudillo</h1><p>Computational Physics</p><div class="bar"><i></i></div></div>';
  document.body.append(el);
  document.body.classList.add('locked');
  const close = () => { el.classList.add('done'); document.body.classList.remove('locked'); setTimeout(() => el.remove(), 1000); };
  setTimeout(close, 2400);
  el.addEventListener('click', close);
})();