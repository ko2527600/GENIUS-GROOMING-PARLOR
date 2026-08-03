import { put, list, get } from "@vercel/blob";
import crypto from "crypto";

const PREFIX = "bookings/";

function newId() {
  const ts = Date.now().toString(36);
  const rand = crypto.randomBytes(4).toString("hex");
  return `${ts}-${rand}`;
}

export async function createBooking(data) {
  const id = newId();
  const booking = {
    id,
    name: data.name,
    phone: data.phone,
    stylist: data.stylist,
    services: data.services,
    time: data.time,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  await put(`${PREFIX}${id}.json`, JSON.stringify(booking), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: "application/json",
  });

  return booking;
}

async function readBookingBlob(pathname) {
  const result = await get(pathname, { access: "private" });
  if (!result) return null;
  return new Response(result.stream).json();
}

export async function listBookings() {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  const bookings = await Promise.all(blobs.map((b) => readBookingBlob(b.pathname)));
  return bookings
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function updateBookingStatus(id, status) {
  const pathname = `${PREFIX}${id}.json`;
  const booking = await readBookingBlob(pathname);
  if (!booking) return null;

  booking.status = status;
  await put(pathname, JSON.stringify(booking), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });

  return booking;
}
