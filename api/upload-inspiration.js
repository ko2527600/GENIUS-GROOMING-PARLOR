import { put } from "@vercel/blob";
import { rateLimitMiddleware } from "./_lib/rateLimit.js";

// Relays the booking form's inspiration photo through our own server (the
// file arrives as base64 in the body) rather than uploading directly from
// the browser to Blob storage - direct client uploads hit an unresolved
// CORS block on this project's custom domain. Client-side compression (see
// src/utils/compressImage.js) keeps the photo comfortably under Vercel's
// request body limit despite the extra hop.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const rateLimit = rateLimitMiddleware(req, res, 10, 15 * 60 * 1000);
  if (rateLimit.rateLimited) {
    return res.status(429).json(rateLimit.response);
  }

  const { file, filename, contentType } = req.body ?? {};
  if (!file) {
    return res.status(400).json({ ok: false, error: "No file provided" });
  }

  try {
    const base64Data = file.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const blob = await put(`inspiration/${Date.now()}-${filename || "photo.jpg"}`, buffer, {
      access: "public",
      addRandomSuffix: true,
      contentType: contentType || "image/jpeg",
    });

    return res.status(200).json({ ok: true, url: blob.url });
  } catch (err) {
    console.error("Failed to upload inspiration photo:", err);
    return res
      .status(500)
      .json({ ok: false, error: `Upload failed: ${err?.message || err}` });
  }
}
