# Wedding Invitation — Komal & Tushar

An elegant, luxury Indian wedding invitation website built with **React (Vite)**, **Tailwind CSS**, and **Framer Motion**. It is **100% frontend-only** with zero backend or server dependencies.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser!

### 3. Build for Production / Static Hosting
```bash
npm run build
```
The production bundle will be generated in `dist/`, ready to deploy to GitHub Pages, Vercel, Netlify, or any static host.

---

## 📝 How to Edit Content

All wedding details (names, dates, story timeline, family members, venues, RSVP options, photos, UPI QR code, and bank details) are located in a single file:

👉 **[`src/data/content.js`](file:///c:/Users/Ajaymohan/ZZ/Sarvesh/src/data/content.js)**

---

## ✨ Features Included

- **Indian Wedding Aesthetics**: Obsidian background, royal crimson, regal gold accents (`#d4af37`), and traditional `✦ ✦ ✦` dividers.
- **Save the Date Calendar**: 1-click `.ics` calendar download for December 13, 2026 with celebratory confetti.
- **Live Countdown**: Updates every second with zero-padded 3-digit days, hours, minutes, and seconds.
- **Our Story**: Vertical timeline with milestone cards.
- **Our Families**: Groom's Family (Pawar) and Bride's Family (Shinde) cards with fallback avatars.
- **Celebrations**: Haldi, Wedding Ceremony, and Reception cards with maps links and dress codes.
- **Photo Gallery**: Category filter chips (`All`, `prewedding`, `engagement`, `family`, `travel`) and full-screen lightbox.
- **Venue**: Swaraj Sanskrutik Bhavan with interactive Google Maps embed and directions button.
- **RSVP**: Client-side form supporting attending status, guest counts, events, and meal preferences.
- **Wedding Gifts**: Scan to Pay UPI card (`komaltushar.wedding@oksbi`) and Bank Transfer details with 1-click copy buttons.
- **Gift Registry**: Interactive reservation system (with Bed Linen Set pre-reserved).
- **Guest Book**: Interactive wishes wall with moderation capabilities.
- **Admin Dashboard**: Couple/admin modal for reviewing RSVP tallies and managing gifts.
