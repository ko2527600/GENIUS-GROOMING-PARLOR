import { sendSms } from "./sms.js";
import { sendWhatsappTemplate } from "./whatsapp.js";
import { shop } from "../../src/data/shopData.js";

const SMS_MESSAGES = {
  received: (b) =>
    `Hi ${b.name}, ${shop.name} received your booking request for ${b.services} at ${b.time}. We'll confirm shortly!`,
  confirmed: (b) =>
    `Hi ${b.name}, your ${shop.name} booking for ${b.services} at ${b.time} is CONFIRMED. See you soon!`,
  reminder: (b) =>
    `Hi ${b.name}, it's been a while since your last visit to ${shop.name}! We'd love to see you again - book your next appointment anytime.`,
};

const WHATSAPP_TEMPLATES = {
  received: process.env.WHATSAPP_TEMPLATE_RECEIVED,
  confirmed: process.env.WHATSAPP_TEMPLATE_CONFIRMED,
  reminder: process.env.WHATSAPP_TEMPLATE_REMINDER,
};

const WHATSAPP_PARAMS = {
  received: (b) => [b.name, b.services, b.time],
  confirmed: (b) => [b.name, b.services, b.time],
  reminder: (b) => [b.name],
};

// Tries WhatsApp first (if a template is configured for this event),
// falling back to SMS so the customer is reached either way. Never
// throws - a failed notification should never break a booking request.
export async function notifyCustomer(kind, booking) {
  try {
    const templateName = WHATSAPP_TEMPLATES[kind];
    const sentOnWhatsapp = templateName
      ? await sendWhatsappTemplate(
          booking.phone,
          templateName,
          WHATSAPP_PARAMS[kind](booking),
        )
      : false;

    if (!sentOnWhatsapp) {
      await sendSms(booking.phone, SMS_MESSAGES[kind](booking));
    }
  } catch (err) {
    console.error(`Failed to notify customer (${kind}):`, err);
  }
}
