# Backend — Booking Notifications

A small Express API that receives booking submissions and sends a WhatsApp
notification to the shop via Meta's WhatsApp Cloud API.

## Status

Scaffolded, not yet wired to the frontend or deployed. The frontend
currently notifies the shop with a click-to-chat WhatsApp/SMS link the
customer sends themselves — this backend is the next step up: the site
sends the notification automatically, with no action needed from the
customer.

## What this needs to actually send WhatsApp messages

This can't send anything without real credentials, and those can only come
from an account the business owns:

1. A Meta developer account and a WhatsApp Business Platform app
   (business.facebook.com / developers.facebook.com).
2. A phone number registered to that app — gives you a `WHATSAPP_PHONE_NUMBER_ID`.
3. A permanent access token for that app — `WHATSAPP_TOKEN`.
4. For notifications sent outside a 24-hour reply window (which is the
   normal case here — a customer books, the shop should be notified any
   time of day), Meta requires an **approved message template**. Free-text
   messages only work if the recipient messaged the business number in the
   last 24 hours. Create and get a template approved in Meta Business
   Manager, then set `WHATSAPP_TEMPLATE_NAME`.

None of this can be faked or skipped — it's Meta's policy for any business
sending WhatsApp messages programmatically. Budget a day or two for account
verification and template approval before this can go live.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# fill in .env with real values once you have them
npm run dev
```

Server runs on `http://localhost:3001` by default.

## Endpoints

- `GET /api/health` — uptime check
- `POST /api/bookings` — body: `{ name, phone, barber, service, price, time }`.
  Saves the booking to `data/bookings.json` and attempts a WhatsApp
  notification. Booking is saved even if the WhatsApp send fails (e.g. no
  credentials configured yet) — the response includes `notified: true/false`.

## Deploying

This is a plain Node/Express app — deploy it anywhere that runs Node
(Render, Railway, Fly.io, a Vercel serverless function, etc.). It's
separate from the frontend's static hosting (Vercel/Netlify).

## Wiring it to the frontend

Not done yet. Once this is deployed and `.env` has real WhatsApp
credentials, the `Booking.jsx` confirm step can `POST` here directly,
falling back to today's click-to-chat links if the request fails.
