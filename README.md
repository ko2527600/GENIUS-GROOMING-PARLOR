# Genius Grooming Parlor — Website

A mobile-first website for Genius Grooming Parlor, built to showcase the shop
and let customers book appointments online.

## Status

Early build — placeholder text, prices, and contact info throughout. See
`src/data/shopData.js` to swap in the real business details, and
`src/assets/` for photos/logo once they're ready.

## Stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

## Project Structure

```
src/
  components/    Reusable UI pieces (Navbar, Hero, Services, About, Contact, Booking, Footer)
  pages/         Route-level pages (Home, BookingPage)
  data/          Editable business content (shop info, services/prices, hours)
  App.jsx        Routes + page layout
  main.jsx       App entry point
```

## Pages

- **Home** (`/`) — Hero, Services, About, Contact, all as sections on one page
- **Booking** (`/booking`) — Multi-step booking flow: choose barber → service → time → confirm details

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

Deploys cleanly to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/)
by connecting this GitHub repo — no extra config needed for a Vite app.

## Editing Content

Almost everything customer-facing (shop name, tagline, phone, address, hours,
services, prices, about text) lives in `src/data/shopData.js`. Update that
file and the whole site reflects the change.
