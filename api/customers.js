import { listBookings } from "./_lib/bookings.js";
import { isAuthenticated } from "./_lib/session.js";
import { notifyCustomer } from "./_lib/notify.js";
import { toGhanaDigits } from "./_lib/phone.js";

// Derives a customer list from booking history, grouped by phone number.
// listBookings() returns newest-first, so the first booking seen per
// phone is that customer's most recent visit.
export default async function handler(req, res) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const bookings = await listBookings();
      const byPhone = new Map();

      for (const b of bookings) {
        const key = toGhanaDigits(b.phone);
        const existing = byPhone.get(key);
        if (existing) {
          existing.visits += 1;
        } else {
          byPhone.set(key, {
            phone: b.phone,
            name: b.name,
            lastVisit: b.createdAt,
            lastServices: b.services,
            visits: 1,
          });
        }
      }

      const customers = Array.from(byPhone.values()).sort(
        (a, b) => new Date(b.lastVisit) - new Date(a.lastVisit),
      );

      return res.status(200).json({ ok: true, customers });
    } catch (err) {
      console.error("Failed to load customers:", err);
      return res.status(500).json({ ok: false, error: "Failed to load customers" });
    }
  }

  // POST - send a "come back" reminder to one customer, identified by
  // phone in the body (not a URL param, so we don't have to worry about
  // encoding "+" and spaces into a route segment).
  if (req.method === "POST") {
    const { phone } = req.body ?? {};
    if (!phone) {
      return res.status(400).json({ ok: false, error: "Missing phone" });
    }

    try {
      const key = toGhanaDigits(phone);
      const bookings = await listBookings();
      const latest = bookings.find((b) => toGhanaDigits(b.phone) === key);
      if (!latest) {
        return res.status(404).json({ ok: false, error: "Customer not found" });
      }

      await notifyCustomer("reminder", { name: latest.name, phone: latest.phone });
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Failed to send reminder:", err);
      return res.status(500).json({ ok: false, error: "Failed to send reminder" });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
