import { getAvailableSlots, checkAvailability } from "./_lib/bookings.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { date, stylist, time } = req.query;

    if (!date || !stylist) {
      return res.status(400).json({ ok: false, error: "Missing date or stylist" });
    }

    try {
      if (time) {
        // Check specific time slot
        const available = await checkAvailability(date, time, stylist);
        return res.status(200).json({ ok: true, available });
      } else {
        // Get all available slots for the date/stylist
        const slots = await getAvailableSlots(date, stylist);
        return res.status(200).json({ ok: true, slots });
      }
    } catch (err) {
      console.error("Failed to check availability:", err);
      return res.status(500).json({ ok: false, error: "Failed to check availability" });
    }
  }

  res.setHeader("Allow", "GET");
  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
