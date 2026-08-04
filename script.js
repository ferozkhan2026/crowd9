
  document.querySelectorAll('.pillar-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pillar-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.pillar-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(`.pillar-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active');
    });
  });

  document.querySelectorAll('.faq-item').forEach(item => {
    const a = item.querySelector('.faq-a');
    if (item.classList.contains('open')) a.style.maxHeight = a.scrollHeight + 'px';
    item.querySelector('.faq-q').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => { i.classList.remove('open'); i.querySelector('.faq-a').style.maxHeight = 0; });
      if (!isOpen) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  // --- scroll-driven 3D heading tilt: rotates into place as you scroll, live both directions ---
  (function(){
    const els = Array.from(document.querySelectorAll('.section-head h2, .cta-box h2'));
    if (!els.length) return;
    let ticking = false;
    function update(){
      const vh = window.innerHeight;
      els.forEach(el => {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        let p = 1 - (center - vh * 0.42) / (vh * 0.5);
        p = Math.max(0, Math.min(1, p));
        const rotate = (1 - p) * 42;
        const rise = (1 - p) * 26;
        el.style.transform = `perspective(1200px) rotateX(${rotate}deg) translateY(${rise}px)`;
        el.style.opacity = 0.25 + p * 0.75;
      });
      ticking = false;
    }
    window.addEventListener('scroll', () => { if (!ticking){ requestAnimationFrame(update); ticking = true; } }, {passive:true});
    window.addEventListener('resize', update);
    update();
  })();

  // --- subtle smooth parallax on the hero collage while scrolling ---
  (function(){
    const collage = document.querySelector('.hero-collage');
    if (!collage) return;
    let ticking = false;
    function update(){
      const y = window.scrollY;
      collage.style.transform = `translateY(${Math.min(y * 0.18, 120)}px)`;
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking){ requestAnimationFrame(update); ticking = true; }
    }, {passive:true});
  })();

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, {threshold:0.1});
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  const countIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.countTo, 10);
      const suffix = el.dataset.suffix || '';
      const dur = 900; const start = performance.now();
      function step(now){ const p = Math.min(1,(now-start)/dur); el.textContent = Math.round(p*target)+suffix; if (p<1) requestAnimationFrame(step); }
      requestAnimationFrame(step); countIo.unobserve(el);
    });
  }, {threshold:0.5});
  document.querySelectorAll('[data-count-to]').forEach(el => countIo.observe(el));

  // Cinematic cursor-tracking glow
  (function(){
    const glow = document.getElementById('cursorGlow');
    if (!glow || matchMedia('(hover:none)').matches) return;
    let mouseX = innerWidth/2, mouseY = innerHeight/2, curX = mouseX, curY = mouseY;
    let active = false;
    window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; active = true; });
    (function loop(){
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      if (active) glow.style.transform = `translate3d(${curX-280}px, ${curY-280}px, 0)`;
      requestAnimationFrame(loop);
    })();
  })();

