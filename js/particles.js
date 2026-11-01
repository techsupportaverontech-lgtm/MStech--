// Particles Module — MS Technologies
// Canvas-based particle animation with Google Antigravity style cursor glow trail

const CONFIG = {
  particleCount: 70,
  particleCountMobile: 35,
  mobileBreakpoint: 768,
  minRadius: 1,
  maxRadius: 3,
  connectionDistance: 130,
  connectionOpacity: 0.12,
  mouseRadius: 100,
  mouseForce: 0.015,
  baseSpeed: 0.25,
  color: { r: 0, g: 180, b: 216 }, // #00b4d8
};

// Standard background particle
class Particle {
  constructor(canvasW, canvasH) {
    this.x = Math.random() * canvasW;
    this.y = Math.random() * canvasH;
    this.vx = (Math.random() - 0.5) * CONFIG.baseSpeed;
    this.vy = (Math.random() - 0.5) * CONFIG.baseSpeed;
    this.radius = CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius);
    this.opacity = 0.2 + Math.random() * 0.4;
    this.color = `rgba(${CONFIG.color.r}, ${CONFIG.color.g}, ${CONFIG.color.b}, ${this.opacity})`;
  }

  update(canvasW, canvasH, mouseX, mouseY) {
    this.x += this.vx;
    this.y += this.vy;

    if (mouseX !== null && mouseY !== null) {
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius && dist > 0) {
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius * CONFIG.mouseForce;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }
    }

    this.vx *= 0.999;
    this.vy *= 0.999;

    // Edge wrapping
    if (this.x < -this.radius) this.x = canvasW + this.radius;
    else if (this.x > canvasW + this.radius) this.x = -this.radius;
    if (this.y < -this.radius) this.y = canvasH + this.radius;
    else if (this.y > canvasH + this.radius) this.y = -this.radius;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// Google Antigravity Cursor Glow Trail Particle
class TrailParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // Upward float direction (antigravity drift)
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = -0.5 - Math.random() * 1.2; // Float up
    this.radius = 2 + Math.random() * 6; // Thicker glow
    this.life = 1.0; // Decay life from 1 to 0
    this.decay = 0.015 + Math.random() * 0.02; // Decay speed
    
    // Cycle glowing colors
    const colors = [
      { r: 0, g: 180, b: 216 },   // neon cyan
      { r: 144, g: 224, b: 239 }, // soft blue
      { r: 108, g: 99, b: 255 },  // violet
      { r: 255, g: 255, b: 255 }  // pure white
    ];
    this.colorSelect = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
  }

  draw(ctx) {
    if (this.life <= 0) return;

    // Glowing orb effect (using radial gradients)
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3.5);
    g.addColorStop(0, `rgba(${this.colorSelect.r}, ${this.colorSelect.g}, ${this.colorSelect.b}, ${this.life * 0.65})`);
    g.addColorStop(0.3, `rgba(${this.colorSelect.r}, ${this.colorSelect.g}, ${this.colorSelect.b}, ${this.life * 0.2})`);
    g.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 3.5, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
  }
}

class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.trailParticles = [];
    this.mouseX = null;
    this.mouseY = null;
    this.animationId = null;
    this.isVisible = true;

    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  get isMobile() {
    return window.innerWidth < CONFIG.mobileBreakpoint;
  }

  get targetCount() {
    return this.isMobile ? CONFIG.particleCountMobile : CONFIG.particleCount;
  }

  resize() {
    const parent = this.canvas.parentElement || document.body;
    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx.scale(dpr, dpr);

    this.width = rect.width;
    this.height = rect.height;
  }

  createParticles() {
    const count = this.targetCount;
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this.width, this.height));
    }
  }

  bindEvents() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.resize();
        const diff = this.targetCount - this.particles.length;
        if (diff > 0) {
          for (let i = 0; i < diff; i++) {
            this.particles.push(new Particle(this.width, this.height));
          }
        } else if (diff < 0) {
          this.particles.splice(this.targetCount);
        }
      }, 200);
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;

      // Spawn antigravity trail particles
      if (!this.isMobile && Math.random() < 0.6) {
        this.trailParticles.push(new TrailParticle(this.mouseX, this.mouseY));
      }
    });

    window.addEventListener('mouseleave', () => {
      this.mouseX = null;
      this.mouseY = null;
    });

    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      if (this.isVisible && !this.animationId) {
        this.animate();
      }
    });
  }

  drawConnections() {
    const { r, g, b } = CONFIG.color;
    const maxDist = CONFIG.connectionDistance;
    const maxDistSq = maxDist * maxDist;
    const len = this.particles.length;

    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const opacity = CONFIG.connectionOpacity * (1 - dist / maxDist);
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          this.ctx.lineWidth = 0.55;
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    if (!this.isVisible) {
      this.animationId = null;
      return;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Render background particles
    for (const p of this.particles) {
      p.update(this.width, this.height, this.mouseX, this.mouseY);
      p.draw(this.ctx);
    }

    // Render Connections
    this.drawConnections();

    // Render Trail particles
    for (let i = this.trailParticles.length - 1; i >= 0; i--) {
      const tp = this.trailParticles[i];
      tp.update();
      tp.draw(this.ctx);
      if (tp.life <= 0) {
        this.trailParticles.splice(i, 1);
      }
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

let system = null;

function init() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none'; // Allow clicking through details

  system = new ParticleSystem(canvas);
}

function destroy() {
  if (system) {
    system.destroy();
    system = null;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { init, destroy, ParticleSystem, Particle };
