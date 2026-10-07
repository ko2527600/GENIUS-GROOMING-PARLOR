// Resizes and recompresses a photo client-side before upload. Phone camera
// photos are routinely 3000px+ and several MB - shrinking to a size no
// gallery or phone screen needs anyway cuts the upload payload by 5-10x,
// which is most of why uploads felt slow on a normal mobile connection.
async function actuallyCompress(file, { maxDimension, quality }) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Failed to load image"));
      el.src = url;
    });

    let { width, height } = img;
    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(img, 0, 0, width, height);

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Compression produced no data"))),
        "image/jpeg",
        quality,
      );
    });

    return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Falls back to the original file on any failure - some formats (HEIC from
// iPhones, mainly) can't be decoded via <img> in most browsers, and an
// upload that still works uncompressed beats one that's blocked outright.
export default async function compressImage(file, { maxDimension = 1920, quality = 0.82 } = {}) {
  try {
    return await actuallyCompress(file, { maxDimension, quality });
  } catch {
    return file;
  }
}
