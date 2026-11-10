# Design Specification: "Warteg Tech" Interactive Portfolio (M. Sirojul Munir)

**Date:** 2026-11-10  
**Author:** Antigravity Team & M. Sirojul Munir  
**Status:** In Review / Ready for Implementation  

---

## 1. Executive Summary & Creative Direction

### 1.1 The Concept
"Warteg Tech" mentransformasikan portofolio web developer M. Sirojul Munir menjadi sebuah pengalaman interaktif bertema **Warung Tegal (Warteg) Modern & Kreatif**. Konsep ini menggabungkan kearifan lokal Indonesia yang hangat, akrab, dan ikonik dengan kecakapan teknis web developer profesional (*Clean code, 60fps animations, responsive design, interactive state management*).

### 1.2 Target Audience & Vibe
* **Audience:** Klien, recruiter teknologi, dan komunitas developer.
* **Kesan:** Sangat berkesan (*viral & memorable*), kreatif, *out-of-the-box*, ramah, namun tetap membuktikan kemampuan teknis koding tingkat tinggi.
* **Tone of Voice:** Jenaka dan santai khas warung makan, tetapi substansi data, keahlian, dan portfolio proyek tetap 100% nyata dan profesional.

---

## 2. Visual Design & Theme System

### 2.1 Color Palette & Tokens
* **Warteg Classic Royal Blue:** `#0284C7` / `#0369A1` (Warna cat ikonik dinding luar warteg).
* **Kuning Spanduk Kunyit:** `#F59E0B` / `#EAB308` (Warna spanduk kain legendaris & kuning telur).
* **Hijau Daun Pisang:** `#10B981` / `#059669` (Aksen kesegaran, badge halal kodingan, status ready).
* **Oranye Sambal:** `#EA580C` / `#C2410C` (Warna aksi utama CTA, tombol bungkus proyek).
* **Putih Keramik Bersih:** `#FFFFFF` & `#F8FAFC` (Latar piring & etalase kaca bersih).
* **Tinta Struk / Slate:** `#0F172A` / `#334155` (Tipografi nota bon).

### 2.2 Typography
* **Spanduk Display:** Font sans-serif tebal dengan outline & shadow retro khas lukisan cat spanduk kaki lima.
* **Body & UI:** `Inter` (bersih, terbaca jelas).
* **Kode & Nota Bon:** `JetBrains Mono` / Monospace khas cetakan struk kasir warteg.

---

## 3. Structural Breakdown & Sections

### 3.1 Intro Preloader: "Buka Tirai Warteg"
* **Visual:**
  * Tirai kain warteg dua warna (kuning dan biru) menutupi layar.
  * Piring putih di tengah dengan uap mengepul (*steam animation*).
  * Loading counter: `0% ➔ 100%` dengan teks status:
    * `0% - 30%`: *Menanak Nasi Putih Pulen...*
    * `31% - 65%`: *Menggoreng Telor Dadar & Orek Tempe...*
    * `66% - 99%`: *Meracik Bumbu Kodingan...*
    * `100%`: *✓ Siap Disajikan!*
  * Tirai tersibak halus ke kiri dan kanan dengan efek kain (*curtain slide*), mengungkap website.

### 3.2 Hero Section: "Koki Web Fullstack"
* **Spanduk Warteg Header:** Spanduk kain khas di bagian atas:
  `"WARTEG TECH SIROJUL — SPESIALIS WEB & OTOMASI"`
* **Headline:** *"Nasi Rames Fullstack, Lauk Fleksibel, Kodingan Gurih!"*
* **Deskripsi:** M. Sirojul Munir — Koki web developer dengan pengalaman 7+ tahun meracik aplikasi web Laravel, React, mobile Flutter, dan otomasi workflow.
* **Badges Ikonik:**
  * `✓ Halal 100% Bebas Bug`
  * `✓ Buka 24 Jam Nonstop`
  * `✓ Harga Sahabat Kualitas Resto Bintang Lima`
* **CTA Buttons:**
  * `[ Bungkus Proyek via WhatsApp ]` (Tombol Oranye Sambal)
  * `[ Buka Etalase Lauk ]` (Scroll ke Menu)
* **Frame Foto Profil:**
  * Foto profil M. Sirojul Munir dengan frame etalase kaca berlampu hangat warteg.

### 3.3 Interactive Etalase Kaca: "Pilih Menu Lauk (Skills & Tech Stack)"
Bagian paling interaktif di mana pengunjung bisa memilih lauk:
1. **Lauk Pauk & Analogi Koding:**
   * **Telor Dadar Krispi:** Backend & Database (Laravel, PHP, MySQL) — *Tebal, gurih, fondasi utama kenyang*.
   * **Ikan Tongkol Balado:** Frontend Modern (React, Tailwind CSS, JavaScript) — *Segar, pedas, responsif di semua rasa*.
   * **Orek Tempe Manis:** Mobile Apps (Flutter, Dart) — *Lauk wajib serbaguna di Android & iOS*.
   * **Ayam Goreng Lengkuas:** Fullstack Architecture & API Integration — *Daging utama untuk proyek enterprise*.
   * **Sayur Asem Segar:** UI/UX Design & Video/Motion — *Bikin tampilan melek dan menyegarkan mata*.
   * **Es Teh Manis Jumbo:** Workflow Automation & Tools — *Penghilang dahaga rutinitas manual*.
2. **Interaktivitas "Piring Virtual":**
   * Setiap lauk bisa di-klik untuk dimasukkan ke **Piring Pesanan**.
   * Piring pesanan memiliki penghitung mini dan tombol: *"Bungkus Menu Ini ke WhatsApp"* yang otomatis menghasilkan format pesan custom.

### 3.4 Menu Paket Ramesan (Featured Projects)
* Disajikan sebagai **Nampan Paket Spesial**:
  * **Paket 1 - Nasi Rames Cafein:** Website & POS Management.
  * **Paket 2 - Paket Hemat Absensi:** Sistem absensi digital & approval.
  * **Paket 3 - Prasmanan ERP:** Sistem operasional & inventory.
  * **Paket 4 - Es Automation:** Workflow automation bisnis.
* Setiap paket memiliki kartu foto makanan + thumbnail preview sistem, deskripsi tech stack, link demo live, dan link source code.

### 3.5 Nota Bon Kasir (Experience & Track Record)
* Tampilan visual berupa **Kertas Bon Warteg / Struk Pembayaran Klasik**:
  * Daftar pesanan jam terbang: `7+ Tahun Pengalaman`, `6+ Proyek Skala Besar`, `3+ Industri`.
  * Detail tempat kerja dan peran yang pernah dijalani.
  * Cap lunas berwarna merah/biru: `[ LUNAS / TERUJI ]`.

### 3.6 Kontak: "Kasir & Bungkus Pesanan"
* Formulir / CTA langsung terhubung ke WhatsApp Sirojul Munir dengan format pesan ramah.
* Tombol media sosial: GitHub, Instagram, Email.

---

## 4. Implementation Details

### 4.1 Asset Handling
* Gambar lauk (Telor, Ikan, Tempe, Es Teh) disiapkan dengan fallback CSS/SVG visual cards yang sangat menarik, dan langsung bisa diganti/ditambah saat user mengirim foto makanan asli.
* Menggunakan file gambar lokal di `assets/` agar loading instan dan offline-ready.

### 4.2 Interactive Scripting (`script.js`)
* State manager ringan untuk `piringPesanan`:
  * Array item yang dipilih.
  * Dynamic counter di floating badge piring.
  * WhatsApp URL generator dengan pesan terisi otomatis berdasarkan lauk yang dipilih.
* Animasi buka tirai preloader & sound toggle (opsional / audio efek desis wajan jika diinginkan).

---

## 5. Verification & Testing Checklist
- [ ] Preloader tirai warteg berjalan mulus (~2.5s) dan bisa di-skip.
- [ ] Responsif 100% di layar smartphone (mobile-friendly layout).
- [ ] Interaksi klik lauk ke piring virtual berjalan tanpa error.
- [ ] Tombol CTA WhatsApp menghasilkan tautan chat yang valid.
- [ ] Seluruh data proyek, link GitHub, dan foto Sirojul Munir tetap utuh dan berfungsi.
