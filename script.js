/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO — script.js
   ═══════════════════════════════════════════════════════════════ */
'use strict';

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
