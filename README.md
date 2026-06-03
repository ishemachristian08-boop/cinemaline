# 🎬 cinemaline System

> "As a movie enthusiast, I want a seamless and cinematic way to book my experience, so that I can spend less time waiting and more time enjoying the show."

cinemaline is a premium, full-stack cinema management and booking platform designed with a "User-First" philosophy. Built with React and Express, it delivers a high-fidelity experience from the first click to the final credits.

---

## 📖 The cinemaline User Stories

### 🍿 The Movie Goer (Customer)
- **As a customer**, I want to browse current movies in a beautiful, high-resolution grid, so that I can easily decide what to watch.
- **As a customer**, I want an interactive seat map with clear pricing tiers (VIP, Standard, Economy), so that I can pick the perfect spot for my budget.
- **As a customer**, I want to build my own custom snack combos in a step-by-step wizard, so that I can get exactly what I want with a bundle discount.
- **As a customer**, I want a secure, progress-tracked checkout, so that I feel confident and informed while paying for my tickets.
- **As a customer**, I want a digital ticket wallet with QR codes, so that I can enter the theater and pick up my snacks without carrying paper.

### 🏛️ The Hall Manager (Admin)
- **As an admin**, I want a real-time analytics dashboard with revenue trends and occupancy heatmaps, so that I can monitor the theater's performance at a glance.
- **As an admin**, I want a visual screening timeline, so that I can manage movie schedules and hall assignments across the day.
- **As an admin**, I want a live activity feed, so that I can see bookings and snack collections as they happen.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), React Router v6, Context API, Recharts, Lucide React.
- **Backend**: Node.js, Express, CORS.
-- **Database/Auth**: (Firebase removed) The project uses a mock backend by default. Replace with your preferred database/auth solution.
- **Design**: Modern Vanilla CSS with Glassmorphism and Custom Micro-animations.

---

## 🚀 Getting Started

1. **Clone the project**
2. (Optional) Configure an authentication/database provider. Firebase has been removed; the project ships with stubbed auth and a mock server. If you want a production backend, integrate your preferred provider and update `client/src/firebase/config.js` accordingly.
3. **Run the Backend**:
   ```bash
   cd server
   npm install
   npm run dev
   ```
4. **Run the Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

---

## 📂 Project Architecture

```text
cinemaline/
├── client/                 # Frontend Application
│   ├── src/pages/          # 8 Cinematic Screens
│   ├── src/context/        # Global State (Cart & Auth)
│   └── src/components/     # Reusable UI Blocks
├── server/                 # Express API
│   └── index.js            # Mock API & Order Management
└── database/               # Firestore Security Rules
```
