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

## Admin Dashboard (`/admin`)

Requires these environment variables set on Vercel (Project → Settings →
Environment Variables):

- `ADMIN_PASSWORD` — the password used to log in
- `SESSION_SECRET` — any long random string, used to sign the login session
- A Vercel Blob store connected to the project (bookings are saved via
  `@vercel/blob`)

## SMS / WhatsApp Notifications

Booking status changes (received, confirmed, completed) and the "come back"
reminder text customers automatically via
[Africa's Talking](https://africastalking.com/) SMS, with an optional
WhatsApp template as a first attempt. Configure:

- `AT_API_KEY`, `AT_USERNAME` — Africa's Talking credentials (`sandbox` for
  testing)
- `AT_SENDER_ID` — optional approved sender ID
- `WHATSAPP_TEMPLATE_RECEIVED` / `_CONFIRMED` / `_COMPLETED` / `_REMINDER` —
  optional, only needed if using WhatsApp templates instead of plain SMS

Without these set, notifications silently no-op — bookings still work.

### Automatic re-engagement reminders

`api/cron/reminders.js` runs daily (see `vercel.json` → `crons`) and texts
any customer who hasn't visited in `reminderIntervalDays` (set in
`shopData.js`, default 14 days) since their last booking. Vercel Cron on the
Hobby plan is limited to once a day, which this already matches.

Set `CRON_SECRET` on Vercel to stop anyone else from triggering this
endpoint — Vercel automatically sends it as the `Authorization` header when
invoking the cron.

## Live Chat / Enquiries

The site can show a [Tawk.to](https://www.tawk.to/) live chat widget so
visitors can message the shop directly and the owner can reply from the
Tawk.to phone app. It's off by default. To turn it on:

1. Sign up free at [tawk.to](https://www.tawk.to/) and create a property
   for the business
2. Go to Administration → Chat Widget → the embed code will contain a URL
   like `https://embed.tawk.to/<propertyId>/<widgetId>`
3. Paste those two values into `liveChat` in `src/data/shopData.js`
