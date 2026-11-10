/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO — script.js
   ═══════════════════════════════════════════════════════════════ */
'use strict';

// ═══════════════════════════════════════════════════════════════
// CINEMATIC INTRO PRELOADER (WebGL Ray + Particle Convergence)
// Inspired by ekawahyu-portofolio.vercel.app
// ═══════════════════════════════════════════════════════════════
(() => {
  const preloaderEl = document.getElementById('preloader');
  const webglCanvas = document.getElementById('preloader-webgl');
  const particleCanvas = document.getElementById('preloader-particles');
  const counterEl = document.getElementById('preloader-counter');
  const progressFill = document.getElementById('preloader-progress-fill');
  const progressGlow = document.getElementById('preloader-progress-glow');

  if (!preloaderEl || !particleCanvas) return;

  // Lock scroll during intro animation
  document.body.style.overflow = 'hidden';

  let isFinished = false;
  let webglAnimId = null;
  let particleAnimId = null;
  let progressInterval = null;

  const exitPreloader = () => {
    if (isFinished) return;
    isFinished = true;

    if (progressInterval) clearInterval(progressInterval);
    if (counterEl) counterEl.textContent = '100%';
    if (progressFill) progressFill.style.width = '100%';
    if (progressGlow) progressGlow.style.transform = 'translateX(0%)';

    preloaderEl.classList.add('preloader--done');

    setTimeout(() => {
      if (webglAnimId) cancelAnimationFrame(webglAnimId);
      if (particleAnimId) cancelAnimationFrame(particleAnimId);
      preloaderEl.style.display = 'none';
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('preloaderFinished'));
    }, 850);
  };

  // 1. WebGL Background Shader (Electric Lightning / Plasma Ray)
  if (webglCanvas) {
    try {
      const gl = webglCanvas.getContext('webgl') || webglCanvas.getContext('experimental-webgl');
      if (gl) {
        const isMobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
        const targetFps = isMobile ? 30 : 60;
        const frameInterval = 1000 / targetFps;

        const resizeGL = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5);
          const w = Math.max(1, Math.floor(webglCanvas.clientWidth * dpr));
          const h = Math.max(1, Math.floor(webglCanvas.clientHeight * dpr));
          if (webglCanvas.width !== w || webglCanvas.height !== h) {
            webglCanvas.width = w;
            webglCanvas.height = h;
          }
        };
        resizeGL();
        window.addEventListener('resize', resizeGL, { passive: true });

        const vsSource = `
          attribute vec2 aPosition;
          void main() {
            gl_Position = vec4(aPosition, 0.0, 1.0);
          }
        `;

        const fsSource = `
          precision mediump float;
          uniform vec2 iResolution;
          uniform float iTime;
          uniform float uHue;
          uniform float uXOffset;
          uniform float uSpeed;
          uniform float uIntensity;
          uniform float uSize;
          #define OCTAVE_COUNT 8
          vec3 hsv2rgb(vec3 c) {
            vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
            return c.z * mix(vec3(1.0), rgb, c.y);
          }
          float hash11(float p) {
            p = fract(p * .1031);
            p *= p + 33.33;
            p *= p + p;
            return fract(p);
          }
          float hash12(vec2 p) {
            vec3 p3 = fract(vec3(p.xyx) * .1031);
            p3 += dot(p3, p3.yzx + 33.33);
            return fract((p3.x + p3.y) * p3.z);
          }
          mat2 rotate2d(float theta) {
            float c = cos(theta);
            float s = sin(theta);
            return mat2(c, -s, s, c);
          }
          float noise(vec2 p) {
            vec2 ip = floor(p);
            vec2 fp = fract(p);
            float a = hash12(ip);
            float b = hash12(ip + vec2(1.0, 0.0));
            float c = hash12(ip + vec2(0.0, 1.0));
            float d = hash12(ip + vec2(1.0, 1.0));
            vec2 t = smoothstep(0.0, 1.0, fp);
            return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
          }
          float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            for (int i = 0; i < OCTAVE_COUNT; ++i) {
              value += amplitude * noise(p);
              p *= rotate2d(0.45);
              p *= 2.0;
              amplitude *= 0.5;
            }
            return value;
          }
          void main() {
            vec2 uv = gl_FragCoord.xy / iResolution.xy;
            uv = 2.0 * uv - 1.0;
            float aspect = iResolution.x / iResolution.y;
            uv.x *= aspect;
            uv.x += uXOffset;

            float path = sin(uv.y * 3.0 - iTime * 2.5) * 0.25 
                       + sin(uv.y * 5.0 + iTime * 1.5) * 0.15;
            vec2 noiseUv = uv * uSize * 1.5;
            float n = 2.0 * fbm(noiseUv + 1.2 * iTime * uSpeed) - 1.0;
            float scale = aspect < 1.0 ? (aspect * 1.1) : 1.0;
            float center = (path + n * 0.4) * scale;
            uv.y += n * 0.2 * scale;
            float dist = abs(uv.x - center);

            vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
            vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
            float alpha = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
            gl_FragColor = vec4(col, alpha);
          }
        `;

        const compileShader = (type, src) => {
          const s = gl.createShader(type);
          gl.shaderSource(s, src);
          gl.compileShader(s);
          if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            gl.deleteShader(s);
            return null;
          }
          return s;
        };

        const vs = compileShader(gl.VERTEX_SHADER, vsSource);
        const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
        if (vs && fs) {
          const prog = gl.createProgram();
          gl.attachShader(prog, vs);
          gl.attachShader(prog, fs);
          gl.linkProgram(prog);
          if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            gl.useProgram(prog);

            const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
            const buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

            const aPos = gl.getAttribLocation(prog, 'aPosition');
            gl.enableVertexAttribArray(aPos);
            gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

            const uRes = gl.getUniformLocation(prog, 'iResolution');
            const uTime = gl.getUniformLocation(prog, 'iTime');
            const uHue = gl.getUniformLocation(prog, 'uHue');
            const uXOff = gl.getUniformLocation(prog, 'uXOffset');
            const uSpd = gl.getUniformLocation(prog, 'uSpeed');
            const uInt = gl.getUniformLocation(prog, 'uIntensity');
            const uSz = gl.getUniformLocation(prog, 'uSize');

            const startT = performance.now();
            let lastT = 0;

            const renderGL = (now) => {
              if (isFinished) return;
              if (document.visibilityState !== 'hidden') {
                if (now - lastT >= frameInterval) {
                  lastT = now;
                  gl.viewport(0, 0, webglCanvas.width, webglCanvas.height);
                  gl.uniform2f(uRes, webglCanvas.width, webglCanvas.height);
                  gl.uniform1f(uTime, (now - startT) / 1000);
                  gl.uniform1f(uHue, 220.0);
                  gl.uniform1f(uXOff, 0.0);
                  gl.uniform1f(uSpd, 1.6);
                  gl.uniform1f(uInt, 1.2);
                  gl.uniform1f(uSz, 2.0);
                  gl.drawArrays(gl.TRIANGLES, 0, 6);
                }
              }
              webglAnimId = requestAnimationFrame(renderGL);
            };
            webglAnimId = requestAnimationFrame(renderGL);
          }
        }
      }
    } catch (e) {
      console.warn('WebGL preloader fallback:', e);
    }
  }

  // 2. Particle Convergence Text System
  class Particle {
    constructor() {
      this.pos = { x: 0, y: 0 };
      this.vel = { x: 0, y: 0 };
      this.acc = { x: 0, y: 0 };
      this.target = { x: 0, y: 0 };
      this.closeEnoughTarget = 90;
      this.maxSpeed = 1;
      this.maxForce = 0.1;
      this.particleSize = 3;
      this.startColor = { r: 59, g: 130, b: 246 };
      this.targetColor = { r: 255, g: 255, b: 255 };
      this.colorWeight = 0;
      this.colorBlendRate = 0.015;
    }

    move() {
      let speedFactor = 1;
      const dx = this.target.x - this.pos.x;
      const dy = this.target.y - this.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.closeEnoughTarget) {
        speedFactor = dist / this.closeEnoughTarget;
      }

      let steerX = 0;
      let steerY = 0;
      if (dist > 0) {
        const desiredX = (dx / dist) * this.maxSpeed * speedFactor;
        const desiredY = (dy / dist) * this.maxSpeed * speedFactor;
        steerX = desiredX - this.vel.x;
        steerY = desiredY - this.vel.y;
      }

      const steerDist = Math.sqrt(steerX * steerX + steerY * steerY);
      if (steerDist > 0) {
        steerX = (steerX / steerDist) * this.maxForce;
        steerY = (steerY / steerDist) * this.maxForce;
      }

      this.acc.x += steerX;
      this.acc.y += steerY;
      this.vel.x += this.acc.x;
      this.vel.y += this.acc.y;
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
      this.acc.x = 0;
      this.acc.y = 0;
    }

    draw(ctx) {
      if (this.colorWeight < 1) {
        this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1);
      }
      const r = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight);
      const g = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight);
      const b = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight);

      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const pCtx = particleCanvas.getContext('2d');
  const particles = [];
  let offCanvas = null;
  let pFrameCount = 0;

  const getRandomEdgePos = (cx, cy, radius, w, h) => {
    const rx = Math.random() * w;
    const ry = Math.random() * h;
    const dx = rx - cx;
    const dy = ry - cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d > 0) {
      return { x: cx + (dx / d) * radius, y: cy + (dy / d) * radius };
    }
    return { x: rx, y: ry };
  };

  const setupParticles = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = particleCanvas.parentElement.getBoundingClientRect();
    const w = Math.round(rect.width || 800);
    const h = Math.round(rect.height || 220);

    particleCanvas.width = w * dpr;
    particleCanvas.height = h * dpr;
    particleCanvas.style.width = `${w}px`;
    particleCanvas.style.height = `${h}px`;
    pCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Create crisp offscreen text
    offCanvas = document.createElement('canvas');
    offCanvas.width = w;
    offCanvas.height = h;
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';

    const scale = Math.min(1, Math.max(0.48, w / 700));
    const font1Size = Math.round(44 * scale);
    const font2Size = Math.round(58 * scale);

    // Line 1: Welcome To My
    offCtx.font = `800 ${font1Size}px 'Inter', system-ui, sans-serif`;
    const grad = offCtx.createLinearGradient(w / 2 - 200 * scale, 0, w / 2 + 200 * scale, 0);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.5, '#DBEAFE');
    grad.addColorStop(1, '#93C5FD');
    offCtx.fillStyle = grad;
    offCtx.fillText('Welcome To My', w / 2, h / 2 - font1Size * 0.72);

    // Line 2: Portofolio Website
    offCtx.font = `900 ${font2Size}px 'Inter', system-ui, sans-serif`;
    offCtx.fillStyle = '#2563EB';
    offCtx.shadowColor = 'rgba(37, 99, 235, 0.5)';
    offCtx.shadowBlur = 15;
    offCtx.fillText('Portofolio Website', w / 2, h / 2 + font2Size * 0.68);
    offCtx.shadowBlur = 0;

    const imgData = offCtx.getImageData(0, 0, w, h).data;
    const step = w < 480 ? 3 : 4;
    const validPixels = [];

    for (let c = 0; c < imgData.length; c += step * 4) {
      if (imgData[c + 3] > 70) {
        validPixels.push(c);
      }
    }

    // Shuffle pixel indices for dynamic convergence
    for (let i = validPixels.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = validPixels[i];
      validPixels[i] = validPixels[j];
      validPixels[j] = t;
    }

    particles.length = 0;
    const maxRadius = Math.max(w, h) * 0.95;

    for (let i = 0; i < validPixels.length; i++) {
      const c = validPixels[i];
      const targetX = (c / 4) % w;
      const targetY = Math.floor(c / 4 / w);

      const p = new Particle();
      const spawn = getRandomEdgePos(w / 2, h / 2, maxRadius, w, h);
      p.pos.x = spawn.x;
      p.pos.y = spawn.y;
      p.maxSpeed = Math.random() * 8 + 8;
      p.maxForce = p.maxSpeed * 0.12;
      p.particleSize = Math.random() * 1.5 + 2.2;
      p.colorBlendRate = Math.random() * 0.03 + 0.01;
      p.startColor = { r: 59, g: 130, b: 246 };
      p.targetColor = { r: imgData[c], g: imgData[c + 1], b: imgData[c + 2] };
      p.target.x = targetX;
      p.target.y = targetY;
      particles.push(p);
    }
  };

  setupParticles();

  const renderParticles = () => {
    if (isFinished) return;
    if (document.visibilityState === 'hidden') {
      particleAnimId = requestAnimationFrame(renderParticles);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = particleCanvas.width / dpr;
    const h = particleCanvas.height / dpr;

    pCtx.clearRect(0, 0, w, h);
    pFrameCount++;

    let fadeAlpha = 0;
    if (pFrameCount > 70) {
      fadeAlpha = Math.min(1, (pFrameCount - 70) / 45);
    }

    pCtx.globalAlpha = Math.max(0, 1 - fadeAlpha);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.move();
      p.draw(pCtx);
    }

    if (offCanvas && fadeAlpha > 0) {
      pCtx.globalAlpha = fadeAlpha;
      pCtx.drawImage(offCanvas, 0, 0);
    }
    pCtx.globalAlpha = 1;

    particleAnimId = requestAnimationFrame(renderParticles);
  };

  particleAnimId = requestAnimationFrame(renderParticles);

  // 3. Smooth Progress Counter (0% to 100%)
  let progressVal = 0;
  progressInterval = setInterval(() => {
    progressVal++;
    if (counterEl) counterEl.textContent = `${progressVal}%`;
    if (progressFill) progressFill.style.width = `${progressVal}%`;
    if (progressGlow) progressGlow.style.transform = `translateX(${progressVal - 100}%)`;

    if (progressVal >= 100) {
      clearInterval(progressInterval);
      setTimeout(exitPreloader, 250);
    }
  }, 38);

  // Click or Escape/Enter to skip
  preloaderEl.addEventListener('click', exitPreloader);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') exitPreloader();
  }, { once: true });

  // Absolute safety timeout (5.5s)
  setTimeout(exitPreloader, 5500);
})();

// ── Navbar: scroll-aware glassmorphism ───────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

const progressBar = document.getElementById('scroll-progress-bar');

function updateNavbar() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Update top reading progress bar
  if (progressBar) {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll > 0) {
      const scrollPercent = (window.scrollY / totalScroll) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }
  }
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// Active nav link highlight on scroll
const sections = document.querySelectorAll('section[id]');
function updateActiveNavLink() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}
window.addEventListener('scroll', updateActiveNavLink, { passive: true });

// ── Hamburger menu ───────────────────────────────────────────────
const hamburger   = document.getElementById('nav-hamburger');
const navLinksEl  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  navLinksEl.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinksEl.addEventListener('click', e => {
  if (e.target.classList.contains('nav-link')) {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinksEl.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ── Typing effect ────────────────────────────────────────────────
const ROLES = [
  'Web Developer',
  'Mobile App Developer',
  'Workflow Automation Engineer',
  'Content Creator',
  'Digital Marketing Specialist',
];

const typedTextEl = document.getElementById('typed-text');
let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
let typingTimer;

function type() {
  const currentRole = ROLES[roleIndex];

  if (isDeleting) {
    charIndex--;
    typedTextEl.textContent = currentRole.slice(0, charIndex);
  } else {
    charIndex++;
    typedTextEl.textContent = currentRole.slice(0, charIndex);
  }

  let delay = isDeleting ? 50 : 95;

  if (!isDeleting && charIndex === currentRole.length) {
    delay = 1800; // pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % ROLES.length;
    delay = 400;
  }

  typingTimer = setTimeout(type, delay);
}

type();

// ── Scroll reveal (IntersectionObserver) ────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children inside same parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, idx * 90);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));


// ── Footer year ──────────────────────────────────────────────────
document.getElementById('footer-year').textContent = new Date().getFullYear();

// ── Smooth anchor scrolling with offset ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH   = navbar.offsetHeight;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Parallax subtle on hero orbs ────────────────────────────────
const orbs = document.querySelectorAll('.orb');
window.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e;
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (clientX - cx) / cx;
  const dy = (clientY - cy) / cy;

  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 6;
    orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
}, { passive: true });

// ── Lightbox Modal for Project Previews ─────────────────────────
const lightboxModal    = document.getElementById('lightbox-modal');
const lightboxBackdrop = document.getElementById('lightbox-backdrop');
const lightboxClose    = document.getElementById('lightbox-close');
const lightboxImg      = document.getElementById('lightbox-img');
const lightboxTitle    = document.getElementById('lightbox-title');
const lightboxCaption  = document.getElementById('lightbox-caption');

const project1ImgWrap  = document.getElementById('project-1-imgwrap');
const project2ImgWrap  = document.getElementById('project-2-imgwrap');
const project3ImgWrap  = document.getElementById('project-3-imgwrap');

function openLightbox(src, title, caption) {
  if (!lightboxModal) return;
  lightboxImg.src = src;
  if (lightboxTitle) lightboxTitle.textContent = title || 'Preview Proyek';
  if (lightboxCaption) lightboxCaption.textContent = caption || '';
  lightboxModal.classList.add('active');
  lightboxModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightboxModal) return;
  lightboxModal.classList.remove('active');
  lightboxModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (project1ImgWrap) {
  project1ImgWrap.addEventListener('click', () => {
    openLightbox(
      'assets/project-cafein.png',
      'Aplikasi Mobile CAFEIN',
      'INKINDO Jawa Timur — Flutter, Dart, Laravel & Google AI Studio'
    );
  });
}

if (project2ImgWrap) {
  project2ImgWrap.addEventListener('click', () => {
    openLightbox(
      'assets/project-record.png',
      'Website E-Commerce Record Shoes',
      'PT Jaya Mandiri (Record) — Laravel, PHP, React & REST API'
    );
  });
}

if (project3ImgWrap) {
  project3ImgWrap.addEventListener('click', () => {
    openLightbox(
      'assets/project-automation.jpg',
      'Workflow Automation System (n8n & Gemini AI)',
      'PT Jaya Mandiri (Record) — WhatsApp Webhook, Chatbot AI & Ads Performance Analyzer'
    );
  });
}

const project5ImgWrap = document.getElementById('project-5-imgwrap');
if (project5ImgWrap) {
  project5ImgWrap.addEventListener('click', () => {
    openLightbox(
      'assets/project-erp.png',
      'Sistem ERP — Kelola Bisnis Lebih Cerdas',
      'Manajemen Bisnis Terintegrasi — Laravel, PHP, TypeScript & MySQL'
    );
  });
}

const project4ImgWrap = document.getElementById('project-4-imgwrap');
if (project4ImgWrap) {
  project4ImgWrap.addEventListener('click', () => {
    openLightbox(
      'assets/project-absensi.png',
      'Sistem Absensi Karyawan (Foto + GPS Counter/Toko)',
      'PT Jaya Mandiri (Record) — Portal JMN Matrix, GPS Geolocation & Camera Verification'
    );
  });
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
    closeLightbox();
  }
});
