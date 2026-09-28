import { createBooking, listBookings, checkAvailability } from "./_lib/bookings.js";
import { isAuthenticated } from "./_lib/session.js";
import { notifyCustomer } from "./_lib/notify.js";
import { validateBookingData } from "./_lib/validation.js";
import { rateLimitMiddleware } from "./_lib/rateLimit.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Rate limit: 5 booking attempts per 15 minutes per IP
    const rateLimit = rateLimitMiddleware(req, res, 5, 15 * 60 * 1000);
    if (rateLimit.rateLimited) {
      return res.status(429).json(rateLimit.response);
    }

    const bookingData = req.body ?? {};

    // Validate and sanitize input
    const validation = validateBookingData(bookingData);
    if (!validation.isValid) {
      return res.status(400).json({ 
        ok: false, 
        error: "Validation failed", 
        errors: validation.errors 
      });
    }

    const { name, phone, stylist, services, time, date, payment, inspirationPhoto } = validation.sanitized;

    // Check availability before creating booking
    try {
      const available = await checkAvailability(date, time, stylist);
      if (!available) {
        return res.status(409).json({ ok: false, error: "Time slot no longer available" });
      }

      const booking = await createBooking({ 
        name, 
        phone, 
        stylist, 
        services, 
        time, 
        date,
        payment,
        inspirationPhoto 
      });
      await notifyCustomer("received", booking);
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
