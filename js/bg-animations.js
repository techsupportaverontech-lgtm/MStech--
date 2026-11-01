// bg-animations.js — MS Technologies
// Full-page background animation system:
//  1. Enhanced hero particle network (upgraded from particles.js)
//  2. Animated tech grid overlay on every section
//  3. Floating wave canvas in footer area

/* ════════════════════════════════════════
   1.  HERO — Enhanced Particle Network
   ════════════════════════════════════════ */
function initHeroParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const isMobile = () => window.innerWidth < 768;

  let W, H, dpr, particles = [], mouse = { x: null, y: null }, raf;

  const CFG = {
    count:       () => isMobile() ? 55 : 110,
    connDist:    160,
    mouseRadius: 140,
    speed:       0.35,
    col:         { r: 0, g: 180, b: 216 },   // #00b4d8
    col2:        { r: 144, g: 224, b: 239 },  // #90e0ef
  };

  function resize() {
    const p = canvas.parentElement || document.body;
    const r = p.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width  = r.width  * dpr;
    canvas.height = r.height * dpr;
    canvas.style.width  = r.width  + 'px';
    canvas.style.height = r.height + 'px';
    ctx.scale(dpr, dpr);
    W = r.width; H = r.height;
  }

  class Dot {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * CFG.speed;
      this.vy = (Math.random() - 0.5) * CFG.speed;
      this.r  = 1 + Math.random() * 2.2;
      this.a  = 0.25 + Math.random() * 0.55;
      // Alternate colour slightly for depth
      const t  = Math.random();
      const cr = Math.round(CFG.col.r + t * (CFG.col2.r - CFG.col.r));
      const cg = Math.round(CFG.col.g + t * (CFG.col2.g - CFG.col.g));
      const cb = Math.round(CFG.col.b + t * (CFG.col2.b - CFG.col.b));
      this.fill = `rgba(${cr},${cg},${cb},${this.a})`;
      // Pulse
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.018 + Math.random() * 0.02;
    }
    update() {
      this.pulse += this.pulseSpeed;
      const pulseR = this.r + Math.sin(this.pulse) * 0.5;

      // Mouse repulsion
      if (mouse.x !== null) {
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < CFG.mouseRadius * CFG.mouseRadius && d2 > 0) {
          const d = Math.sqrt(d2);
          const f = (CFG.mouseRadius - d) / CFG.mouseRadius * 0.022;
          this.vx += (dx / d) * f;
          this.vy += (dy / d) * f;
        }
      }

      this.vx *= 0.999; this.vy *= 0.999;
      const sp = Math.hypot(this.vx, this.vy);
      if (sp > CFG.speed * 2.2) {
        this.vx = this.vx / sp * CFG.speed * 2.2;
        this.vy = this.vy / sp * CFG.speed * 2.2;
      }

      this.x += this.vx; this.y += this.vy;
      if (this.x < -this.r) this.x = W + this.r;
      else if (this.x > W + this.r) this.x = -this.r;
      if (this.y < -this.r) this.y = H + this.r;
      else if (this.y > H + this.r) this.y = -this.r;

      return pulseR;
    }
    draw(pr) {
      // Glow
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, pr * 3);
      g.addColorStop(0, this.fill);
      g.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(this.x, this.y, pr * 3, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      // Core dot
      ctx.beginPath(); ctx.arc(this.x, this.y, pr, 0, Math.PI * 2);
      ctx.fillStyle = this.fill; ctx.fill();
    }
  }

  function connections() {
    const { r, g, b } = CFG.col;
    const maxSq = CFG.connDist * CFG.connDist;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dSq = dx * dx + dy * dy;
        if (dSq < maxSq) {
          const d = Math.sqrt(dSq);
          const op = 0.18 * (1 - d / CFG.connDist);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${op})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    if (document.hidden) { raf = requestAnimationFrame(loop); return; }
    ctx.clearRect(0, 0, W, H);
    const radii = particles.map(p => p.update());
    connections();
    particles.forEach((p, i) => p.draw(radii[i]));
    raf = requestAnimationFrame(loop);
  }

  function build() {
    particles = [];
    const n = CFG.count();
    for (let i = 0; i < n; i++) particles.push(new Dot());
  }

  // Events
  canvas.style.cssText = 'position:absolute;top:0;left:0;pointer-events:auto;';
  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { cancelAnimationFrame(raf); resize(); build(); loop(); }, 220);
  });

  resize(); build(); loop();
}

/* ════════════════════════════════════════
   2.  TECH GRID — SVG animated grid overlay
   ════════════════════════════════════════ */
function initTechGrid() {
  // Inject one fixed full-page grid behind everything
  if (document.getElementById('tech-grid-bg')) return;

  const div = document.createElement('div');
  div.id = 'tech-grid-bg';
  div.setAttribute('aria-hidden', 'true');
  div.style.cssText = `
    position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;
  `;

  // Grid lines via SVG pattern
  div.innerHTML = `
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none"
            stroke="rgba(0,180,216,0.055)" stroke-width="0.8"/>
        </pattern>
        <radialGradient id="gridFade" cx="50%" cy="50%" r="70%">
          <stop offset="0%"   stop-color="white" stop-opacity="1"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
        <mask id="gridMask">
          <rect width="100%" height="100%" fill="url(#gridFade)"/>
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridMask)"/>
    </svg>

    <canvas id="grid-dots-canvas" style="position:absolute;inset:0;width:100%;height:100%;"></canvas>
  `;

  document.body.prepend(div);

  // Animate travelling dots along the grid lines
  const canvas = document.getElementById('grid-dots-canvas');
  const ctx = canvas.getContext('2d');
  const GRID = 60;
  let W, H;

  function resizeGrid() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width  = W * dpr; canvas.height = H * dpr;
    canvas.style.width  = W + 'px'; canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
  }

  // Travelling pulses on grid
  class Pulse {
    constructor() { this.reset(); }
    reset() {
      const horiz = Math.random() < 0.5;
      if (horiz) {
        this.x  = Math.random() * W;
        this.y  = Math.round(Math.random() * Math.ceil(H / GRID)) * GRID;
        this.vx = (Math.random() < 0.5 ? 1 : -1) * (0.8 + Math.random() * 1.2);
        this.vy = 0;
      } else {
        this.x  = Math.round(Math.random() * Math.ceil(W / GRID)) * GRID;
        this.y  = Math.random() * H;
        this.vx = 0;
        this.vy = (Math.random() < 0.5 ? 1 : -1) * (0.8 + Math.random() * 1.2);
      }
      this.life  = 0;
      this.maxLife = 120 + Math.random() * 180;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.life++;
      if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      if (!isFinite(this.x) || !isFinite(this.y) || !isFinite(this.life) || !isFinite(this.maxLife) || this.maxLife <= 0) {
        this.reset();
        return;
      }
      const alpha = Math.max(0, Math.sin((this.life / this.maxLife) * Math.PI) * 0.55);
      const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 6);
      grd.addColorStop(0,   `rgba(0,180,216,${alpha})`);
      grd.addColorStop(0.4, `rgba(144,224,239,${alpha * 0.5})`);
      grd.addColorStop(1,   'transparent');
      ctx.beginPath();
      ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      // Bright core
      ctx.beginPath();
      ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,180,216,${alpha * 1.8})`;
      ctx.fill();
    }
  }

  const PULSE_COUNT = window.innerWidth < 768 ? 12 : 28;
  const pulses = Array.from({ length: PULSE_COUNT }, () => new Pulse());

  // Stagger start positions
  pulses.forEach((p, i) => { for (let k = 0; k < i * 7; k++) p.update(); });

  let gridRaf;
  function gridLoop() {
    ctx.clearRect(0, 0, W, H);
    pulses.forEach(p => { p.update(); p.draw(); });
    gridRaf = requestAnimationFrame(gridLoop);
  }

  let grt;
  window.addEventListener('resize', () => {
    clearTimeout(grt);
    grt = setTimeout(resizeGrid, 220);
  });

  resizeGrid();
  gridLoop();
}

/* ════════════════════════════════════════
   3.  WAVE CANVAS — flowing waves in footer zone
   ════════════════════════════════════════ */
function initWaveBackground() {
  const footer = document.querySelector('.footer');
  if (!footer) return;

  // Insert canvas before footer
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:relative;overflow:hidden;height:120px;margin-top:-60px;pointer-events:none;z-index:0;';
  wrap.setAttribute('aria-hidden', 'true');

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;bottom:0;left:0;width:100%;height:100%;';
  wrap.appendChild(canvas);
  footer.parentElement.insertBefore(wrap, footer);

  const ctx = canvas.getContext('2d');
  let W, H, t = 0, waveRaf;

  function resizeWave() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.offsetWidth || window.innerWidth;
    H = canvas.offsetHeight || 120;
    canvas.width  = W * dpr; canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
  }

  const waves = [
    { amp: 18, freq: 0.012, speed: 0.022, phase: 0,    alpha: 0.18, y: 0.55 },
    { amp: 12, freq: 0.018, speed: 0.030, phase: 1.5,  alpha: 0.12, y: 0.70 },
    { amp: 22, freq: 0.008, speed: 0.015, phase: 3.0,  alpha: 0.09, y: 0.40 },
  ];

  function drawWave(wave) {
    ctx.beginPath();
    const baseY = H * wave.y;
    ctx.moveTo(0, baseY);
    for (let x = 0; x <= W; x += 2) {
      const y = baseY + Math.sin(x * wave.freq + t * wave.speed + wave.phase) * wave.amp
                      + Math.sin(x * wave.freq * 0.5 + t * wave.speed * 1.3 + wave.phase) * wave.amp * 0.4;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();

    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0,   `rgba(0,180,216,0)`);
    grad.addColorStop(0.3, `rgba(0,180,216,${wave.alpha})`);
    grad.addColorStop(0.7, `rgba(144,224,239,${wave.alpha * 0.8})`);
    grad.addColorStop(1,   `rgba(0,180,216,0)`);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  function waveLoop() {
    t++;
    ctx.clearRect(0, 0, W, H);
    waves.forEach(w => drawWave(w));
    waveRaf = requestAnimationFrame(waveLoop);
  }

  window.addEventListener('resize', resizeWave);
  resizeWave();
  waveLoop();
}

/* ════════════════════════════════════════
   4.  HERO AURORA — colour morphing glow orbs
   ════════════════════════════════════════ */
function initHeroAurora() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const wrap = document.createElement('div');
  wrap.setAttribute('aria-hidden', 'true');
  wrap.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;';

  const orbs = [
    { size: 520, x: '10%',  y: '30%', color: 'rgba(0,180,216,0.13)',   dur: '18s', delay: '0s'  },
    { size: 400, x: '70%',  y: '60%', color: 'rgba(0,119,182,0.11)',   dur: '22s', delay: '3s'  },
    { size: 350, x: '50%',  y: '10%', color: 'rgba(144,224,239,0.09)', dur: '15s', delay: '6s'  },
    { size: 300, x: '85%',  y: '20%', color: 'rgba(0,180,216,0.08)',   dur: '25s', delay: '1s'  },
    { size: 280, x: '-5%',  y: '70%', color: 'rgba(0,180,216,0.10)',   dur: '20s', delay: '9s'  },
  ];

  orbs.forEach(o => {
    const el = document.createElement('div');
    el.style.cssText = `
      position:absolute;
      width:${o.size}px; height:${o.size}px;
      left:${o.x}; top:${o.y};
      background: radial-gradient(circle, ${o.color} 0%, transparent 70%);
      border-radius:50%;
      filter:blur(72px);
      animation: orbDrift ${o.dur} ease-in-out infinite;
      animation-delay: ${o.delay};
      --orb-duration:${o.dur};
      --orb-delay:${o.delay};
    `;
    wrap.appendChild(el);
  });

  hero.style.position = 'relative';
  hero.prepend(wrap);
}

/* ════════════════════════════════════════
   Bootstrap
   ════════════════════════════════════════ */
function initAllBgAnimations() {
  initHeroAurora();
  initHeroParticles();
  initTechGrid();
  initWaveBackground();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllBgAnimations);
} else {
  initAllBgAnimations();
}

export { initAllBgAnimations };
