import { toGhanaDigits } from "./phone.js";

// Sends a plain-text SMS through Africa's Talking. Returns false (never
// throws) when the credentials aren't configured yet or the send fails,
// so callers can treat this as a best-effort notification channel.
export async function sendSms(phone, message) {
  const apiKey = process.env.AT_API_KEY;
  const username = process.env.AT_USERNAME;
  if (!apiKey || !username) return false;

  const baseUrl =
    username === "sandbox"
      ? "https://api.sandbox.africastalking.com/version1/messaging"
      : "https://api.africastalking.com/version1/messaging";

  const body = new URLSearchParams({
    username,
    to: `+${toGhanaDigits(phone)}`,
    message,
  });
  if (process.env.AT_SENDER_ID) body.set("from", process.env.AT_SENDER_ID);

  try {
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: {
        apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body,
    });
    if (!res.ok) {
      console.error("Africa's Talking SMS failed:", res.status, await res.text());
      return false;
    }
    const data = await res.json();
    const recipient = data?.SMSMessageData?.Recipients?.[0];
    if (recipient && recipient.status !== "Success") {
      console.error("Africa's Talking SMS rejected:", recipient.status);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Africa's Talking SMS error:", err);
    return false;
  }
}
