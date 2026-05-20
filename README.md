<div align="center">

# DentaCare

### Full-Stack Dental Clinic Management System

A production-ready platform that digitises the complete workflow of a dental clinic —
patient booking, doctor scheduling, admin control, and secure online payments.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-4ade80?style=for-the-badge)](https://denta-care-lemon.vercel.app/)<br>
![Performance](https://img.shields.io/badge/Performance-100%2F100-brightgreen?style=flat-square)
![Accessibility](https://img.shields.io/badge/Accessibility-95%2F100-brightgreen?style=flat-square)
![Best Practices](https://img.shields.io/badge/Best%20Practices-100%2F100-brightgreen?style=flat-square)
![SEO](https://img.shields.io/badge/SEO-91%2F100-brightgreen?style=flat-square)

</div>

---
## Overview

DentaCare serves three distinct user roles, each with a fully authenticated interface:

- **Patients** browse doctors, book appointments, pay online, and manage their profile
- **Doctors** manage their schedule, mark appointments as completed, and track earnings
- **Admins** have full control over doctors, appointments, and clinic analytics

---

## Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**
- React 18 + Vite
- Tailwind CSS (custom design tokens)
- GSAP + ScrollTrigger (custom animation hooks)
- Zustand (persisted state — 3 role stores)
- Recharts (appointment charts)
- React Router DOM v6 (protected layouts)
- Axios

</td>
<td valign="top" width="50%">

**Backend**
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT (role-based — patient / doctor / admin)
- bcryptjs
- Cloudinary (image uploads)
- Stripe (card payments)
- Nodemailer (OTP emails)

</td>
</tr>
</table>

---

## Features

### Patient
- Browse doctors with search, specialty filter, sort by fees or experience
- Interactive booking modal — week view calendar + time slot picker
- Full auth flow — signup, login, forgot password with OTP email, reset password
- Pay for appointments via **Stripe** (redirect checkout + verification)
- View all appointments with live status badges (pending / confirmed / completed / cancelled)
- Edit profile — name, phone, photo
- Cancel unpaid appointments (slot released back to doctor)

### Doctor Portal
- Dashboard with greeting, today's schedule, stats cards, and Recharts bar chart
- View, complete, and cancel appointments
- Earnings tracking (completed appointments only)
- Edit profile — name, fees, about, availability toggle, photo

### Admin Panel
- Stats dashboard — doctors, patients, appointments
- Appointment status bar chart (Recharts)
- Add doctors with Cloudinary image upload
- Delete doctors, toggle availability
- View and cancel any appointment in the system

### Technical
- Custom GSAP hooks — `useFadeIn`, `useScrollFade`, `useFloating`, `usePageLeave`, `useCountUp`
- Full English / French i18n via custom `useT` hook (single source of truth)
- Skeleton loaders for all async operations
- Smart fallback data when API is unavailable
- Stripe payment verification on redirect return

---

## Project Structure

```
dentacare/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── layouts/     # AdminShell, DoctorShell (protected route wrappers)
│       │   ├── ui/          # LoginCard, Skeleton, Components (Modal, Badge, StatCard, PageLoader)
│       │   ├── website/     # Navbar, Footer, Hero, Services, Doctors, BookingCTA
│       │   ├── admin/       # Sidebar, AdminNavbar
│       │   └── doctor/      # DoctorSidebar, DoctorNavbar
│       ├── hooks/
│       │   ├── gsap/        # useFadeIn, useScrollFade, useFloating, usePageLeave, useCountUp
│       │   └── useT.js      # i18n hook
│       ├── lib/             # axios, i18n, stripe, utils
│       ├── pages/
│       │   ├── admin/       # Login, Dashboard, DoctorsList, AddDoctor, Appointments
│       │   ├── doctor/      # Login, Dashboard, Appointments, Earnings, Profile
│       │   └── website/     # Home, About, DoctorsPage, DoctorDetails, Auth, ProfilePage
│       └── store/           # adminStore, doctorStore, userAuth (Zustand + persist)
│
└── backend/
    ├── config/              # db.js, cloudinary.js
    ├── controllers/         # admin, doctor, user, appointment, payment
    ├── middleware/           # authMiddleware, uploadMiddleware
    ├── models/              # Doctor, User, Appointment
    └── routes/              # all route files
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Stripe account (test mode)

### 1. Clone

```bash
git clone https://github.com/amani204/dentacare.git
cd dentacare
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@dentacare.com
ADMIN_PASSWORD=your-admin-password
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:5173
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-app-password
```

```bash
npm run dev   # runs on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend/DentaCare
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

```bash
npm run dev   # runs on http://localhost:5173
```

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@test.com | test123456 |
| Doctor | (set when adding doctor in admin panel) | (set on creation) |
| Admin | from `.env` ADMIN_EMAIL | from `.env` ADMIN_PASSWORD |

### Stripe Test Cards

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Payment succeeds |
| `4000 0025 0000 3155` | Requires 3D Secure |
| `4000 0000 0000 9995` | Payment declined |

Use any future expiry date · any 3-digit CVV · any ZIP code.

---

## Deployment

Backend → **Render** | Frontend → **Vercel**

Key steps:
1. Deploy backend on Render — copy the `onrender.com` URL
2. Deploy frontend on Vercel — set `VITE_API_URL` to your Render URL
3. Update `FRONTEND_URL` on Render to your Vercel URL
4. Add `vercel.json` to frontend for React Router:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

5. Allow all IPs in MongoDB Atlas Network Access (`0.0.0.0/0`)

---

## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Double booking prevention | Server-side slot validation before saving appointment |
| Multi-role authentication | Separate JWT tokens and middleware per role |
| API quota limits | Smart fallback data with 60-min retry cache |
| GSAP memory leaks | `gsap.context()` with proper cleanup in every hook |
| Render free tier cold starts | Preconnect hints + skeleton loaders hide the delay |

---

## What I Learned

- Designing a multi-role authentication system from scratch
- Integrating Stripe for secure online payments
- Building reusable animation hooks with proper cleanup
- Implementing i18n without a library using a custom hook
- Optimising Lighthouse scores — images, accessibility, SEO

---

## Known Limitations

- Render free tier backend sleeps after 15 min inactivity — first request takes ~30s
- Bundle size can be reduced further with route-based code splitting
- No real-time notifications (would require WebSockets or SSE)

---

## Author

**Amani Adjailia**

[![GitHub](https://img.shields.io/badge/GitHub-amani204-181717?style=flat-square&logo=github)](https://github.com/amani204)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-amani-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/amani-a-810721390/)

---

## License

MIT License
