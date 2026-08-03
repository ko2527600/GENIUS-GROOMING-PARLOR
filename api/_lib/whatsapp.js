import { toGhanaDigits } from "./phone.js";

// Sends a pre-approved WhatsApp template message via Meta's Cloud API.
// WhatsApp Business API only allows free-form text within a 24h window
// after the customer messages first - since this fires from a web form,
// it must use an approved template instead. Returns false (never throws)
// when not configured or the send fails.
export async function sendWhatsappTemplate(phone, templateName, params) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId || !templateName) return false;

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: toGhanaDigits(phone),
          type: "template",
          template: {
            name: templateName,
            language: { code: "en_US" },
            components: [
              {
                type: "body",
                parameters: params.map((text) => ({ type: "text", text })),
              },
            ],
          },
        }),
      },
    );
    if (!res.ok) {
      console.error("WhatsApp send failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("WhatsApp send error:", err);
    return false;
  }
}
