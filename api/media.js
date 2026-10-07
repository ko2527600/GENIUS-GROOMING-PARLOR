import { listMedia } from "./_lib/media.js";

// Public - the site's Gallery and Services pages read this to show
// admin-uploaded photos/videos alongside the built-in ones.
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const media = await listMedia();
    return res.status(200).json({ ok: true, media });
  } catch (err) {
    console.error("Failed to list media:", err);
    return res.status(500).json({ ok: false, error: "Failed to load media" });
  }
}
