/* ═══════════════════════════════════════════════════════════════
   WARTEG TECH — script.js
   Interactive Warteg Experience for M. Sirojul Munir Portfolio
   ═══════════════════════════════════════════════════════════════ */
'use strict';

// ═══════════════════════════════════════════════════════════════
// 1. WARTEG TECH INTRO PRELOADER: Buka Tirai Warteg
// ═══════════════════════════════════════════════════════════════
(() => {
  const preloaderEl = document.getElementById('preloader');
  const cardEl = document.getElementById('warteg-loader-card');
  const statusEl = document.getElementById('preloader-status');
  const pctEl = document.getElementById('preloader-pct');
  const fillEl = document.getElementById('preloader-bar-fill');

  if (!preloaderEl) return;

  // Lock scrolling during intro
  document.body.style.overflow = 'hidden';

  let isFinished = false;
  let progress = 0;
  let progressInterval = null;

  const exitPreloader = () => {
    if (isFinished) return;
    isFinished = true;

    if (progressInterval) clearInterval(progressInterval);
    if (pctEl) pctEl.textContent = '100%';
    if (fillEl) fillEl.style.width = '100%';
    if (statusEl) {
      statusEl.textContent = '✓ Siap Disajikan! Silakan Masuk, Bos!';
      statusEl.style.color = '#F59E0B';
    }

    // Brief hold at 100% then split curtains open
    setTimeout(() => {
      preloaderEl.classList.add('preloader--done');

      setTimeout(() => {
        preloaderEl.style.display = 'none';
        document.body.style.overflow = '';
        window.dispatchEvent(new CustomEvent('preloaderFinished'));
      }, 750);
    }, 280);
  };

  // Cooking progress sequence: 0% -> 100% in ~2.1 seconds
  const totalDuration = 2100;
  const stepTime = 25;
  const stepIncrement = 100 / (totalDuration / stepTime);

  progressInterval = setInterval(() => {
    progress += stepIncrement;
    const currentPct = Math.min(100, Math.round(progress));

    if (pctEl) pctEl.textContent = `${currentPct}%`;
    if (fillEl) fillEl.style.width = `${currentPct}%`;

    if (currentPct >= 28 && currentPct < 58) {
      if (statusEl && statusEl.textContent !== 'Goreng Telor & Balado Ikan (Backend/Frontend)...') {
        statusEl.textContent = 'Goreng Telor & Balado Ikan (Backend/Frontend)...';
      }
    } else if (currentPct >= 58 && currentPct < 85) {
      if (statusEl && statusEl.textContent !== 'Meracik Bumbu Otomasi Workflow & AI...') {
        statusEl.textContent = 'Meracik Bumbu Otomasi Workflow & AI...';
      }
    } else if (currentPct >= 85 && currentPct < 100) {
      if (statusEl && statusEl.textContent !== 'Menata Piring Pesanan...') {
        statusEl.textContent = 'Menata Piring Pesanan...';
      }
    }

    if (progress >= 100) {
      clearInterval(progressInterval);
      exitPreloader();
    }
  }, stepTime);

  // Fast forward on click or keypress
  preloaderEl.addEventListener('click', exitPreloader);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') exitPreloader();
  }, { once: true });

  // Absolute safety fallback (4s)
  setTimeout(exitPreloader, 4000);
})();

// ═══════════════════════════════════════════════════════════════
// 2. NAVBAR: Scroll-Aware Glassmorphism & Reading Bar
// ═══════════════════════════════════════════════════════════════
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const progressBar = document.getElementById('scroll-progress-bar');

function updateNavbar() {
  if (!navbar) return;
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

// ═══════════════════════════════════════════════════════════════
// 3. HAMBURGER MENU (MOBILE)
// ═══════════════════════════════════════════════════════════════
const hamburger   = document.getElementById('nav-hamburger');
const navLinksEl  = document.getElementById('nav-links');

if (hamburger && navLinksEl) {
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
}

// ═══════════════════════════════════════════════════════════════
// 4. TYPING EFFECT (WARTEG TECH ROLES)
// ═══════════════════════════════════════════════════════════════
const ROLES = [
  'Fullstack Web Developer (Laravel & React)',
  'Mobile App Developer (Flutter & Dart)',
  'Workflow Automation Engineer (n8n & AI)',
  'Spesialis Otomasi Bisnis & API Integration',
  'Digital Marketer & Creative Tech Specialist',
];

const typedTextEl = document.getElementById('typed-text');
let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
let typingTimer;

function type() {
  if (!typedTextEl) return;
  const currentRole = ROLES[roleIndex];

  if (isDeleting) {
    charIndex--;
    typedTextEl.textContent = currentRole.slice(0, charIndex);
  } else {
    charIndex++;
    typedTextEl.textContent = currentRole.slice(0, charIndex);
  }

  let delay = isDeleting ? 45 : 90;

  if (!isDeleting && charIndex === currentRole.length) {
    delay = 1800; // pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % ROLES.length;
    delay = 350;
  }

  typingTimer = setTimeout(type, delay);
}

if (typedTextEl) {
  type();
}

// ═══════════════════════════════════════════════════════════════
// 5. WARTEG TECH: INTERACTIVE ETALASE & VIRTUAL PLATE BUILDER
// ═══════════════════════════════════════════════════════════════
(() => {
  const dishCards = document.querySelectorAll('.dish-card');
  const floatingPlateBar = document.getElementById('floating-plate-bar');
  const plateCountBadge = document.getElementById('plate-count-badge');
  const plateBarItems = document.getElementById('plate-bar-items');
  const btnResetPlate = document.getElementById('btn-reset-plate');
  const btnOrderWa = document.getElementById('btn-order-wa');

  if (!dishCards.length || !floatingPlateBar) return;

  let selectedDishes = [];

  function updatePlateBar() {
    const count = selectedDishes.length;
    if (plateCountBadge) plateCountBadge.textContent = count;

    if (count > 0) {
      floatingPlateBar.classList.add('is-visible');

      const dishSummary = selectedDishes
        .map(d => `${d.emoji} ${d.shortName}`)
        .join(', ');

      if (plateBarItems) {
        plateBarItems.textContent = dishSummary;
      }

      // Pre-composed WhatsApp message
      const orderLines = [
        'Halo Mas Sirojul Munir,',
        'Saya baru saja meracik racikan menu proyek di Warteg Tech Anda:',
        ...selectedDishes.map((d, i) => `  ${i + 1}. ${d.emoji} ${d.fullName}`),
        '',
        'Saya tertarik mendiskusikan kebutuhan sistem/website ini (fitur, estimasi pengerjaan, dan budget). Apakah ada waktu untuk ngobrol santai?',
        'Terima kasih banyak!'
      ];

      const waText = encodeURIComponent(orderLines.join('\n'));
      if (btnOrderWa) {
        btnOrderWa.href = `https://wa.me/6285706013038?text=${waText}`;
      }
    } else {
      floatingPlateBar.classList.remove('is-visible');
      if (plateBarItems) {
        plateBarItems.textContent = 'Klik lauk di etalase untuk meracik paket';
      }
    }
  }

  dishCards.forEach(card => {
    card.addEventListener('click', () => {
      const dishId = card.getAttribute('data-id');
      const fullName = card.getAttribute('data-name') || '';
      const emojiEl = card.querySelector('.dish-emoji');
      const dishEmoji = emojiEl ? emojiEl.textContent.trim() : '🍽️';
      const shortTitleEl = card.querySelector('.dish-title');
      const shortName = shortTitleEl ? shortTitleEl.textContent.trim() : fullName;
      const btn = card.querySelector('.btn-add-dish');

      const existingIndex = selectedDishes.findIndex(d => d.id === dishId);
      if (existingIndex > -1) {
        selectedDishes.splice(existingIndex, 1);
        card.classList.remove('is-selected');
        if (btn) btn.innerHTML = '<span class="add-icon">+</span> Tambah';
      } else {
        selectedDishes.push({
          id: dishId,
          fullName: fullName,
          shortName: shortName,
          emoji: dishEmoji,
        });
        card.classList.add('is-selected');
        if (btn) btn.innerHTML = '<span class="add-icon">✓</span> Masuk Piring';
      }

      updatePlateBar();
    });
  });

  if (btnResetPlate) {
    btnResetPlate.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedDishes = [];
      dishCards.forEach(card => {
        card.classList.remove('is-selected');
        const btn = card.querySelector('.btn-add-dish');
        if (btn) btn.innerHTML = '<span class="add-icon">+</span> Tambah';
      });
      updatePlateBar();
    });
  }
})();

// ═══════════════════════════════════════════════════════════════
// 6. SCROLL REVEAL (IntersectionObserver)
// ═══════════════════════════════════════════════════════════════
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement?.querySelectorAll('.reveal') || []);
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, Math.max(0, idx) * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

// ═══════════════════════════════════════════════════════════════
// 7. FOOTER YEAR
// ═══════════════════════════════════════════════════════════════
const footerYearEl = document.getElementById('footer-year');
if (footerYearEl) {
  footerYearEl.textContent = new Date().getFullYear();
}

// ═══════════════════════════════════════════════════════════════
// 8. SMOOTH ANCHOR SCROLLING
// ═══════════════════════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = navbar ? navbar.offsetHeight : 0;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ═══════════════════════════════════════════════════════════════
// 9. SUBTLE MOUSE PARALLAX ON HERO ORBS
// ═══════════════════════════════════════════════════════════════
const orbs = document.querySelectorAll('.orb');
if (orbs.length > 0) {
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
}

// ═══════════════════════════════════════════════════════════════
// 10. LIGHTBOX MODAL FOR PROJECT PREVIEWS
// ═══════════════════════════════════════════════════════════════
const lightboxModal    = document.getElementById('lightbox-modal');
const lightboxBackdrop = document.getElementById('lightbox-backdrop');
const lightboxClose    = document.getElementById('lightbox-close');
const lightboxImg      = document.getElementById('lightbox-img');
const lightboxTitle    = document.getElementById('lightbox-title');
const lightboxCaption  = document.getElementById('lightbox-caption');

function openLightbox(src, title, caption) {
  if (!lightboxModal) return;
  if (lightboxImg) lightboxImg.src = src;
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

const projectImageTriggers = [
  { id: 'project-1-imgwrap', src: 'assets/project-cafein.png', title: 'Aplikasi Mobile CAFEIN', caption: 'INKINDO Jawa Timur — Flutter, Dart, Laravel & Google AI Studio' },
  { id: 'project-2-imgwrap', src: 'assets/project-record.png', title: 'Website E-Commerce Record Shoes', caption: 'PT Jaya Mandiri (Record) — Laravel, PHP, React & REST API' },
  { id: 'project-3-imgwrap', src: 'assets/project-automation.jpg', title: 'Workflow Automation System (n8n & Gemini AI)', caption: 'PT Jaya Mandiri (Record) — WhatsApp Webhook, Chatbot AI & Ads Performance Analyzer' },
  { id: 'project-4-imgwrap', src: 'assets/project-absensi.png', title: 'Sistem Absensi Karyawan (Foto + GPS Counter/Toko)', caption: 'PT Jaya Mandiri (Record) — Portal JMN Matrix, GPS Geolocation & Camera Verification' },
  { id: 'project-5-imgwrap', src: 'assets/project-erp.png', title: 'Sistem ERP — Kelola Bisnis Lebih Cerdas', caption: 'Manajemen Bisnis Terintegrasi — Laravel, PHP, TypeScript & MySQL' },
];

projectImageTriggers.forEach(item => {
  const el = document.getElementById(item.id);
  if (el) {
    el.addEventListener('click', () => {
      openLightbox(item.src, item.title, item.caption);
    });
  }
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
    closeLightbox();
  }
});
