# Warteg Tech Interactive Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform M. Sirojul Munir's web developer portfolio into the interactive "Warteg Tech" experience with curtains preloader, authentic Warteg banner hero, interactive food plate skill builder, gourmet project trays, and classic receipt experience timeline.

**Architecture:** Vanilla HTML5, modern CSS3 (with Warteg design tokens and glassmorphism showcase), and modular Vanilla JavaScript for the virtual plate state manager, WhatsApp order formatter, and curtain animations.

**Tech Stack:** HTML5, CSS3, Vanilla JS (ES6+), Google Fonts (Inter, JetBrains Mono, Syne/Cabinet Grotesk), SVG Icons.

## Global Constraints
- Pure Vanilla HTML/CSS/JS without heavy external libraries to ensure instant page speed and 60fps performance.
- Retain all actual professional credentials, work history, projects, and contact data of M. Sirojul Munir.
- 100% mobile-first responsiveness (smooth on smartphones and desktops).
- WhatsApp link must correctly format pre-filled order messages.

---

### Task 1: Preloader Tirai Warteg & Cooking Status Sequence

**Files:**
- Modify: `index.html:18-50`
- Modify: `style.css:160-320`
- Modify: `script.js:6-95`

**Interfaces:**
- Produces: Smooth curtain slide preloader with steaming plate and cooking status updates (`0% -> 100%`), then reveals the site.

- [ ] **Step 1: Write HTML markup for Warteg curtains preloader in `index.html`**
  - Left & right fabric curtains (Warteg Blue `#0284C7` and Yellow `#F59E0B`).
  - Steaming porcelain plate in the center with rising SVG steam waves.
  - Culinary progress bar and status text (`Menanak Nasi Pulen...` -> `Siap Disajikan!`).
  - Skip button and escape key listener.

- [ ] **Step 2: Add CSS animations and styles in `style.css`**
  - Curtain fold shadows and wave texture.
  - Smooth transform `translateX(-100%)` / `translateX(100%)` on complete.
  - Steam floating particle keyframes.
  - Golden progress fill bar.

- [ ] **Step 3: Update preloader sequence logic in `script.js`**
  - Interval timer counting `0% -> 100%` over 2.4s.
  - Text switcher based on percentage thresholds.
  - Click / keydown skip handler.
  - Clean teardown with `document.body.style.overflow = ''`.

- [ ] **Step 4: Verify preloader locally and commit**
  - Run node syntax check on `script.js`.
  - Commit: `feat: implement authentic Warteg curtain preloader with cooking status sequence`.

---

### Task 2: Warteg Banner Header, Navbar, & Koki Web Hero Section

**Files:**
- Modify: `index.html:51-180`
- Modify: `style.css:320-780`
- Modify: `script.js:96-180`

**Interfaces:**
- Produces: Classic hand-painted Warteg banner top bar, updated Warteg themed navbar, and Hero section with koki tech narrative, badges, and photo frame.

- [ ] **Step 1: Update Navbar and Banner in `index.html`**
  - Classic Warteg stitched banner header: `"WARTEG TECH SIROJUL — SPESIALIS WEB & OTOMASI"`.
  - Nav logo: `<WartegTech/>` with badge `Buka 24 Jam`.
  - Nav links: `Etalase Lauk (Skills)`, `Paket Ramesan (Proyek)`, `Nota Kasir (Pengalaman)`, `Bungkus (Kontak)`.

- [ ] **Step 2: Update Hero Section markup in `index.html`**
  - Headline: *"Nasi Rames Fullstack, Lauk Fleksibel, Kodingan Gurih!"*.
  - Role typing effect: *"Koki Web Developer & Workflow Automation"*.
  - Warteg badges: `✓ Halal 100% Bebas Bug`, `✓ Porsi Pas Tanpa Error`, `✓ Rasa Bintang Lima`.
  - CTA buttons: `[ Bungkus Proyek via WhatsApp ]` & `[ Buka Etalase Lauk ]`.
  - Photo frame: Sirojul Munir with warm neon brass Warteg showcase border.

- [ ] **Step 3: Add CSS for Warteg banner and Hero section in `style.css`**
  - Retro drop shadow banner typography.
  - Golden-yellow badges with leaf-green checkmarks.
  - Sambal orange gradient action button (`#EA580C` -> `#C2410C`).

- [ ] **Step 4: Commit Hero section updates**
  - Commit: `feat: add Warteg banner header and Koki Web Hero section`.

---

### Task 3: Interactive Glass Etalase & Virtual Plate ("Pilih Lauk Sendiri")

**Files:**
- Modify: `index.html:181-340`
- Modify: `style.css:781-1150`
- Modify: `script.js:181-290`

**Interfaces:**
- Produces: Interactive food showcase where visitors can click dishes (Telor Dadar, Ikan Tongkol, Orek Tempe, Ayam Lengkuas, Sayur Asem, Es Teh Manis) to build a custom project order and launch WhatsApp with a pre-filled list.

- [ ] **Step 1: Write Etalase Kaca markup in `index.html`**
  - Glass showcase shelf container with warm incandescent overhead lamp glow.
  - Dish cards:
    1. **Telor Dadar Krispi:** Backend & Database (Laravel, PHP, MySQL, PostgreSQL).
    2. **Ikan Tongkol Balado:** Frontend Modern (React, Tailwind CSS, JavaScript).
    3. **Orek Tempe Manis:** Mobile Apps (Flutter, Dart, Responsive UI).
    4. **Ayam Lengkuas:** Fullstack Architecture & API Integration.
    5. **Sayur Asem Segar:** UI/UX Design & Creative Content.
    6. **Es Teh Manis Jumbo:** Workflow Automation & n8n / Make tools.
  - Add to Plate button `[ + Tambah ke Piring ]`.
  - Floating Virtual Plate (*Piring Pesanan*) drawer/pill with item counter and "Bungkus Pesanan" WhatsApp trigger.

- [ ] **Step 2: Add CSS for Etalase and Dish Cards in `style.css`**
  - Glass reflection effect on the showcase.
  - Ceramic plate illustrations / badge graphics with price tags (e.g. `Rp Gratis / Konsultasi`).
  - Active selected state with bouncy spring animation.
  - Floating Order Drawer with glowing sambal orange badge.

- [ ] **Step 3: Implement Virtual Plate state manager in `script.js`**
  - Store selected dishes in an array.
  - Update floating counter badge.
  - Generate WhatsApp click URL: `https://wa.me/6285706013038?text=Halo%20Mas%20Sirojul,%20saya%20mau%20bungkus%20proyek%20dengan%20lauk:%20...`.

- [ ] **Step 4: Commit interactive etalase feature**
  - Commit: `feat: implement interactive Warteg etalase and virtual plate builder`.

---

### Task 4: Featured Projects as "Paket Ramesan" & Experience as "Nota Bon Kasir"

**Files:**
- Modify: `index.html:341-600`
- Modify: `style.css:1151-1550`
- Modify: `script.js:291-360`

**Interfaces:**
- Produces: Project cards styled as deluxe Warteg rames trays, and work experience styled as a classic Indonesian carbon receipt / thermal bill with `[ TERUJI ]` stamp.

- [ ] **Step 1: Update Projects section markup in `index.html`**
  - Title: *"Pilihan Menu Paket Ramesan (Proyek Unggulan)"*.
  - Project Cards:
    - *Paket 1 - Nasi Rames Cafein:* Website & POS Management.
    - *Paket 2 - Paket Hemat Absensi:* Sistem Absensi Digital & Approval.
    - *Paket 3 - Prasmanan ERP:* Sistem Operasional & Inventory.
    - *Paket 4 - Es Automation:* Workflow Automation & Business Bot.
  - Action buttons: `[ Cicipi Demo ]` (Live Web) & `[ Resep Kodingan ]` (GitHub).

- [ ] **Step 2: Update Experience section as "Nota Bon Kasir" in `index.html`**
  - Title: *"Nota Riwayat Jam Terbang (Pengalaman Kerja)"*.
  - Thermal paper styling with zig-zag edge top and bottom.
  - Line items for 7+ years of experience across F&B, E-Commerce, and IT.
  - Circular red/blue rubber stamp: `[ LUNAS & TERUJI ]`.

- [ ] **Step 3: Add CSS for Paket Ramesan and Nota Bon Kasir in `style.css`**
  - Wood/bamboo tray borders for projects.
  - Authentic dashed line receipt divider and monospace tabular numbers.
  - Rubber stamp rotation and ink opacity effect.

- [ ] **Step 4: Commit Paket Ramesan and Nota Bon Kasir**
  - Commit: `feat: style projects as Paket Ramesan and experience as Nota Bon Kasir`.

---

### Task 5: Mobile Verification, Final Polish, and Deployment

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `script.js`

- [ ] **Step 1: Test syntax and responsiveness**
  - Run `node -c script.js` to ensure no syntax errors.
  - Verify layout on mobile widths (320px, 375px, 768px, 1200px).

- [ ] **Step 2: Git commit and push to main**
  - Stage all files, commit with clear message, push to GitHub.
  - Verify Vercel deployment status.
