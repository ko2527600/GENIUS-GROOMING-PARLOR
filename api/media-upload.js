import { handleUpload } from "@vercel/blob/client";
import { isAuthenticated } from "./_lib/session.js";
import { createMediaRecord } from "./_lib/media.js";

// Issues short-lived tokens for direct browser -> Blob storage uploads, so
// photo/video uploads from the admin dashboard never pass through this
// function's own request body (avoiding the platform's body size limit).
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/heic",
            "video/mp4",
            "video/webm",
            "video/quicktime",
          ],
          addRandomSuffix: true,
          tokenPayload: clientPayload,
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const meta = tokenPayload ? JSON.parse(tokenPayload) : {};
        await createMediaRecord({
          url: blob.url,
          pathname: blob.pathname,
          type: meta.type,
          category: meta.category,
          serviceId: meta.serviceId,
        });
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (err) {
    console.error("Media upload token error:", err);
    return res.status(400).json({ ok: false, error: err.message || "Upload failed" });
  }
}
