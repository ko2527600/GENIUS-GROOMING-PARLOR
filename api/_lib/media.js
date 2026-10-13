import { put, list, get, del } from "@vercel/blob";
import crypto from "crypto";

const PREFIX = "media/"; // metadata records
const FILES_PREFIX = "media-files/"; // the actual uploaded photo/video files

function newId() {
  const ts = Date.now().toString(36);
  const rand = crypto.randomBytes(4).toString("hex");
  return `${ts}-${rand}`;
}

async function readRecord(pathname) {
  const result = await get(pathname, { access: "public" });
  if (!result) return null;
  return new Response(result.stream).json();
}

// Uploads a file sent as base64 in the request body (relayed through our
// own server, not the browser talking to Blob storage directly) - see
// api/media.js's POST handler. Direct browser-to-Blob client uploads hit an
// unresolved CORS block on this custom domain, so everything goes through
// here instead; client-side compression (resize + recompress) keeps photos
// comfortably under Vercel's request body limit despite the detour.
export async function createMedia({ file, filename, contentType, type, category, serviceId }) {
  const id = newId();
  const extFromName = filename?.includes(".") ? filename.split(".").pop() : null;
  const ext = extFromName || (type === "video" ? "mp4" : "jpg");

  const base64Data = file.replace(/^data:[^;]+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const fileBlob = await put(`${FILES_PREFIX}${id}.${ext}`, buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: contentType || (type === "video" ? "video/mp4" : "image/jpeg"),
  });

  const record = {
    id,
    url: fileBlob.url,
    filePathname: fileBlob.pathname,
    type,
    category: category || "Hair",
    serviceId: serviceId || null,
    createdAt: new Date().toISOString(),
  };

  await put(`${PREFIX}${id}.json`, JSON.stringify(record), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: "application/json",
  });

  return record;
}

export async function listMedia() {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  const records = await Promise.all(blobs.map((b) => readRecord(b.pathname)));
  return records
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function updateMedia(id, patch) {
  const pathname = `${PREFIX}${id}.json`;
  const record = await readRecord(pathname);
  if (!record) return null;

  const updated = { ...record, ...patch };
  await put(pathname, JSON.stringify(updated), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });

  return updated;
}

export async function deleteMedia(id) {
  const pathname = `${PREFIX}${id}.json`;
  const record = await readRecord(pathname);
  if (!record) return false;

  // The metadata record is what the admin dashboard and the site's Gallery
  // actually list from - delete it regardless of whether removing the
  // underlying file succeeds, so a storage hiccup never leaves an item
  // stuck looking undeletable. A failed file delete just leaves an orphaned
  // blob (a storage cost, not a user-facing bug) instead of blocking removal.
  try {
    await del(record.filePathname);
  } catch (err) {
    console.error(`Failed to delete underlying file for media ${id}:`, err);
  }
  await del(pathname);
  return true;
}
