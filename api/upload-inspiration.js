import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { file, filename, contentType } = req.body;
      
      if (!file) {
        return res.status(400).json({ ok: false, error: "No file provided" });
      }

      // Convert base64 to buffer
      const base64Data = file.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const blob = await put(`inspiration/${Date.now()}-${filename}`, buffer, {
        access: "public",
        addRandomSuffix: true,
        contentType: contentType || "image/jpeg",
      });

      return res.status(200).json({ ok: true, url: blob.url });
    } catch (err) {
      console.error("Failed to upload inspiration photo:", err);
      return res.status(500).json({ ok: false, error: "Failed to upload photo" });
    }
  }

  res.setHeader("Allow", "POST");
  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
