import { handleUpload } from "@vercel/blob/client";
import { rateLimitMiddleware } from "./_lib/rateLimit.js";

// Direct browser -> Blob storage upload for the booking form's inspiration
// photo. Switched from base64-in-the-request-body to this token flow
// because phone camera photos routinely exceed Vercel's ~4.5MB request body
// limit once base64-encoded, which made uploads fail silently for anyone
// on a modern phone.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // This endpoint also receives Vercel's server-to-server "upload completed"
  // callback (see onUploadCompleted below), which carries no useful IP to
  // rate-limit against upload attempts, so only check on the first request
  // of the flow, which is what counts against abuse.
  if (req.body?.type !== "blob.upload-completed") {
    const rateLimit = rateLimitMiddleware(req, res, 10, 15 * 60 * 1000);
    if (rateLimit.rateLimited) {
      return res.status(429).json(rateLimit.response);
    }
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/heic"],
        addRandomSuffix: true,
        maximumSizeInBytes: 15 * 1024 * 1024,
      }),
      onUploadCompleted: async () => {
        // Nothing to persist server-side - the booking form attaches the
        // resulting blob URL to the booking it submits.
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (err) {
    console.error("Inspiration photo upload token error:", err);
    return res.status(400).json({ ok: false, error: err.message || "Upload failed" });
  }
}
