import { updateMedia, deleteMedia } from "../_lib/media.js";
import { isAuthenticated } from "../_lib/session.js";

const VALID_CATEGORIES = ["Hair", "Nails", "Beauty"];

export default async function handler(req, res) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const { id } = req.query;

  if (req.method === "PATCH") {
    const { category, serviceId } = req.body ?? {};
    const patch = {};
    if (category !== undefined) {
      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ ok: false, error: "Invalid category" });
      }
      patch.category = category;
    }
    if (serviceId !== undefined) {
      patch.serviceId = serviceId || null;
    }

    try {
      const media = await updateMedia(id, patch);
      if (!media) {
        return res.status(404).json({ ok: false, error: "Media not found" });
      }
      return res.status(200).json({ ok: true, media });
    } catch (err) {
      console.error("Failed to update media:", err);
      return res.status(500).json({ ok: false, error: "Failed to update media" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deleted = await deleteMedia(id);
      if (!deleted) {
        return res.status(404).json({ ok: false, error: "Media not found" });
      }
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Failed to delete media:", err);
      return res.status(500).json({ ok: false, error: "Failed to delete media" });
    }
  }

  res.setHeader("Allow", "PATCH, DELETE");
  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
