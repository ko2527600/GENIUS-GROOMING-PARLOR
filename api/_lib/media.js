import { put, list, get, del } from "@vercel/blob";
import crypto from "crypto";

const PREFIX = "media/"; // metadata records (the actual photo/video files
// live wherever the client-side upload put them, referenced by `url`/`pathname`)

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

// Writes the metadata record for a file that was already uploaded directly
// from the browser to Blob storage (see api/media-upload.js) - this function
// never touches the file itself.
export async function createMediaRecord({ url, pathname, type, category, serviceId }) {
  const id = newId();
  const record = {
    id,
    url,
    filePathname: pathname,
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
