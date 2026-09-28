import { getBookingStats } from "./_lib/bookings.js";
import { isAuthenticated } from "./_lib/session.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    try {
      const stats = await getBookingStats();
      return res.status(200).json({ ok: true, stats });
    } catch (err) {
      console.error("Failed to get analytics:", err);
      return res.status(500).json({ ok: false, error: "Failed to load analytics" });
    }
  }

  res.setHeader("Allow", "GET");
  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
