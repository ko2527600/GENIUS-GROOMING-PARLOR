import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

async function ensureFile() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(DATA_FILE, "utf-8");
  } catch {
    await writeFile(DATA_FILE, "[]");
  }
}

export async function saveBooking(booking) {
  await ensureFile();
  const raw = await readFile(DATA_FILE, "utf-8");
  const bookings = JSON.parse(raw);
  bookings.push({ ...booking, createdAt: new Date().toISOString() });
  await writeFile(DATA_FILE, JSON.stringify(bookings, null, 2));
  return bookings.at(-1);
}
