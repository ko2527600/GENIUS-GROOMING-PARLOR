// Reads a File/Blob as a base64 data URL, for relaying an upload through
// our own server (see api/media.js, api/upload-inspiration.js) instead of
// uploading directly from the browser to Blob storage, which hits an
// unresolved CORS block on this project's custom domain.
export default function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
