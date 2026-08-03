import { createBooking, listBookings } from "./_lib/bookings.js";
import { isAuthenticated } from "./_lib/session.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, phone, stylist, services, time } = req.body ?? {};

    if (!name || !phone || !services || !time) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    try {
      const booking = await createBooking({ name, phone, stylist, services, time });
      return res.status(201).json({ ok: true, booking });
    } catch (err) {
      console.error("Failed to create booking:", err);
      return res.status(500).json({ ok: false, error: "Failed to save booking" });
    }
  }

  if (req.method === "GET") {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }
    try {
      const bookings = await listBookings();
      return res.status(200).json({ ok: true, bookings });
    } catch (err) {
      console.error("Failed to list bookings:", err);
      return res.status(500).json({ ok: false, error: "Failed to load bookings" });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
