import { Router } from "express";
import { saveBooking } from "../store.js";
import { sendBookingWhatsApp } from "../services/whatsapp.js";

const router = Router();

router.post("/", async (req, res) => {
  const { name, phone, barber, service, price, time } = req.body ?? {};

  if (!name || !phone || !service || !time) {
    return res.status(400).json({ ok: false, error: "Missing required fields" });
  }

  const booking = await saveBooking({ name, phone, barber, service, price, time });

  try {
    await sendBookingWhatsApp({ name, phone, barber, service, price, time });
    booking.notified = true;
  } catch (err) {
    console.error("WhatsApp notification failed:", err.message);
    booking.notified = false;
  }

  res.status(201).json({ ok: true, booking });
});

export default router;
