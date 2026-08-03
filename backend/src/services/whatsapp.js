const {
  WHATSAPP_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID,
  SHOP_WHATSAPP_NUMBER,
  WHATSAPP_TEMPLATE_NAME,
} = process.env;

function buildMessageBody(booking) {
  const text =
    `New booking request\n` +
    `Name: ${booking.name}\n` +
    `Phone: ${booking.phone}\n` +
    `Barber: ${booking.barber}\n` +
    `Service: ${booking.service} (GH₵${booking.price})\n` +
    `Time: ${booking.time}`;

  if (!WHATSAPP_TEMPLATE_NAME) {
    return {
      messaging_product: "whatsapp",
      to: SHOP_WHATSAPP_NUMBER,
      type: "text",
      text: { body: text },
    };
  }

  return {
    messaging_product: "whatsapp",
    to: SHOP_WHATSAPP_NUMBER,
    type: "template",
    template: {
      name: WHATSAPP_TEMPLATE_NAME,
      language: { code: "en_US" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: booking.name },
            { type: "text", text: booking.service },
            { type: "text", text: booking.time },
          ],
        },
      ],
    },
  };
}

export async function sendBookingWhatsApp(booking) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !SHOP_WHATSAPP_NUMBER) {
    throw new Error(
      "WhatsApp is not configured — set WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID and SHOP_WHATSAPP_NUMBER in .env",
    );
  }

  const url = `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildMessageBody(booking)),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`WhatsApp API error (${res.status}): ${errText}`);
  }

  return res.json();
}
