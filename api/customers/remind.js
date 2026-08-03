import { listBookings } from "../_lib/bookings.js";
import { isAuthenticated } from "../_lib/session.js";
import { notifyCustomer } from "../_lib/notify.js";
import { toGhanaDigits } from "../_lib/phone.js";

// Phone comes in the body (not a URL param) so we don't have to worry
// about encoding "+" and spaces into a route segment.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }
  if (!isAuthenticated(req)) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

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
