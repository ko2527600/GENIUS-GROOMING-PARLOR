import { updateBookingStatus } from "../_lib/bookings.js";
import { isAuthenticated } from "../_lib/session.js";

const VALID_STATUSES = ["new", "confirmed", "completed", "cancelled"];

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    res.setHeader("Allow", "PATCH");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const { id } = req.query;
  const { status } = req.body ?? {};

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ ok: false, error: "Invalid status" });
  }

  try {
    const booking = await updateBookingStatus(id, status);
    if (!booking) {
      return res.status(404).json({ ok: false, error: "Booking not found" });
    }
    return res.status(200).json({ ok: true, booking });
  } catch (err) {
    console.error("Failed to update booking:", err);
    return res.status(500).json({ ok: false, error: "Failed to update booking" });
  }
}
