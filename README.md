# Genius Grooming Parlor — Website

A mobile-first website for Genius Grooming Parlor, built to showcase the shop
and let customers book appointments online.

## Status

Real logo, phone number, and business details are wired in. Services,
prices, and most photos are still placeholders — see
`src/data/shopData.js` to swap in the real business details, and
`src/assets/` for photos once more are shared.

## Stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

## Project Structure

```
src/
  components/    Reusable UI pieces (Navbar, Hero, Services, Gallery, About, Contact, Booking, Footer)
  pages/         Route-level pages (Home, BookingPage)
  data/          Editable business content (shop info, services/prices, hours)
  assets/        Logo and photos
  App.jsx        Routes + page layout
  main.jsx       App entry point
backend/         Separate Express API for automated WhatsApp booking
                 notifications — not deployed yet, see backend/README.md
```

## Pages

- **Home** (`/`) — Hero, Services, Gallery, About, Contact, all as sections on one page
- **Booking** (`/booking`) — Multi-step booking flow: choose barber → service → time → confirm details.
  On confirm, the customer can send the booking straight to the shop's
  WhatsApp or SMS with one tap (no backend required for this part).

## Getting Started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview   # preview the production build locally
```

## Deployment

This is a static Vite build, so both platforms deploy it in a couple of
minutes with zero manual config — the settings below are already the
defaults they detect.

### Vercel

1. [vercel.com](https://vercel.com/) → **Add New Project** → import this GitHub repo
2. Framework preset: **Vite** (auto-detected). Build command `npm run build`,
   output directory `dist` (auto-detected)
3. Deploy — you'll get a live `*.vercel.app` URL

`vercel.json` in this repo already tells Vercel to route all paths to
`index.html`, so refreshing or linking directly to `/booking` works.

### Netlify

1. [netlify.com](https://www.netlify.com/) → **Add new site** → import this GitHub repo
2. Build command `npm run build`, publish directory `dist` (auto-detected)
3. Deploy — you'll get a live `*.netlify.app` URL

`public/_redirects` in this repo (copied into every build) tells Netlify
to do the same client-side routing fallback.

### Custom domain

Once she has a domain, both platforms let you attach it directly in their
dashboard under the project's Domains settings — no code changes needed.

## Editing Content

Almost everything customer-facing (shop name, tagline, phone, address, hours,
services, prices, about text) lives in `src/data/shopData.js`. Update that
file and the whole site reflects the change.
