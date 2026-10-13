import { listMedia, updateMedia, deleteMedia, createMedia } from "./_lib/media.js";
import { getSiteConfig, setStaticMediaHidden, setStaticMediaCategory } from "./_lib/siteConfig.js";
import { isAuthenticated } from "./_lib/session.js";

const VALID_CATEGORIES = ["Hair", "Nails", "Beauty"];

export default async function handler(req, res) {
  // ?config=1 - the hidden/recategorized built-in media list (see
  // src/data/mediaLibrary.js + Admin.jsx's "Site Photos & Videos" panel).
  // Handled before the generic GET/PATCH branches below since it shares
  // their HTTP methods but is a different resource.
  if (req.query.config) {
    if (req.method === "GET") {
      try {
        const config = await getSiteConfig();
        return res.status(200).json({ ok: true, config });
      } catch (err) {
        console.error("Failed to load site config:", err);
        return res
          .status(500)
          .json({ ok: false, error: `Failed to load site config: ${err?.message || err}` });
      }
    }

    if (req.method === "PATCH") {
      if (!isAuthenticated(req)) {
        return res.status(401).json({ ok: false, error: "Unauthorized" });
      }
      const { staticId, hidden, category } = req.body ?? {};
      if (!staticId) {
        return res.status(400).json({ ok: false, error: "Missing staticId" });
      }
      if (category !== undefined && category && !VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ ok: false, error: "Invalid category" });
      }

      try {
        let config;
        if (hidden !== undefined) config = await setStaticMediaHidden(staticId, hidden);
        if (category !== undefined) config = await setStaticMediaCategory(staticId, category || null);
        return res.status(200).json({ ok: true, config });
      } catch (err) {
        console.error("Failed to update site config:", err);
        return res
          .status(500)
          .json({ ok: false, error: `Failed to update site config: ${err?.message || err}` });
      }
    }

    res.setHeader("Allow", "GET, PATCH");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // GET - public. The site's Gallery and Services pages read this to show
  // admin-uploaded photos/videos alongside the built-in ones.
  if (req.method === "GET") {
    try {
      const media = await listMedia();
      return res.status(200).json({ ok: true, media });
    } catch (err) {
      console.error("Failed to list media:", err);
      return res.status(500).json({ ok: false, error: "Failed to load media" });
    }
  }

  // POST - admin only. The file is sent as base64 in the body and relayed
  // to Blob storage server-side (not uploaded directly from the browser) -
  // direct browser-to-Blob uploads hit an unresolved CORS block on this
  // custom domain, so everything goes through our own server instead.
  // Client-side compression (see src/utils/compressImage.js) keeps photos
  // well under Vercel's request body limit despite the extra hop.
  if (req.method === "POST") {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }
    const { file, filename, contentType, type, category, serviceId } = req.body ?? {};
    if (!file || !type) {
      return res.status(400).json({ ok: false, error: "Missing file or type" });
    }

    try {
      const media = await createMedia({ file, filename, contentType, type, category, serviceId });
      return res.status(201).json({ ok: true, media });
    } catch (err) {
      console.error("Failed to upload media:", err);
      return res
        .status(500)
        .json({ ok: false, error: `Upload failed: ${err?.message || err}` });
    }
  }

  // PATCH / DELETE - admin only, operate on one item via ?id=
  if (req.method === "PATCH" || req.method === "DELETE") {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ ok: false, error: "Missing id" });
    }

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
        return res
          .status(500)
          .json({ ok: false, error: `Failed to update media: ${err?.message || err}` });
      }
    }

    try {
      const deleted = await deleteMedia(id);
      if (!deleted) {
        return res.status(404).json({ ok: false, error: "Media not found" });
      }
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Failed to delete media:", err);
      return res
        .status(500)
        .json({ ok: false, error: `Failed to delete media: ${err?.message || err}` });
    }
  }

  res.setHeader("Allow", "GET, POST, PATCH, DELETE");
  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
