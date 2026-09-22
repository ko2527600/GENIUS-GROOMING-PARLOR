import { listBookings, markReminderSent } from "../_lib/bookings.js";
import { notifyCustomer } from "../_lib/notify.js";
import { toGhanaDigits } from "../_lib/phone.js";
import { reminderIntervalDays } from "../../src/data/shopData.js";

const INTERVAL_MS = reminderIntervalDays * 24 * 60 * 60 * 1000;

// Runs once a day (see vercel.json "crons"). For each customer, looks
// at their most recent booking: if it's been at least
// `reminderIntervalDays` since that visit and we haven't already
// nagged them about it, sends a "come back" SMS/WhatsApp reminder.
export default async function handler(req, res) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  try {
    const bookings = await listBookings();
    const latestByPhone = new Map();
    for (const b of bookings) {
      const key = toGhanaDigits(b.phone);
      if (!latestByPhone.has(key)) latestByPhone.set(key, b);
    }

    const now = Date.now();
    let sent = 0;

    for (const booking of latestByPhone.values()) {
      if (booking.reminderSentAt) continue;
      const dueAt = new Date(booking.createdAt).getTime() + INTERVAL_MS;
      if (now < dueAt) continue;

      await notifyCustomer("reminder", { name: booking.name, phone: booking.phone });
      await markReminderSent(booking.id);
      sent += 1;
    }

    return res.status(200).json({ ok: true, sent });
  } catch (err) {
    console.error("Failed to run reminders cron:", err);
    return res.status(500).json({ ok: false, error: "Failed to run reminders cron" });
  }
}
