const supportsWebpEncoding = (() => {
  let cached: boolean | undefined;
  return () => {
    if (cached === undefined) {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      cached = canvas.toDataURL("image/webp").startsWith("data:image/webp");
    }
    return cached;
  };
})();

/**
 * Downscales and re-encodes an image in the browser so uploads stay small.
 * GIFs are passed through untouched to keep animation, and the original is kept
 * whenever re-encoding would not make it smaller.
 */
export async function compressImage(source: Blob, maxDimension: number, quality = 0.85): Promise<Blob> {
  if (typeof window === "undefined" || source.type === "image/gif" || !source.type.startsWith("image/")) {
    return source;
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(source);
  } catch {
    return source;
  }

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return source;
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const type = supportsWebpEncoding() ? "image/webp" : "image/jpeg";
  const compressed = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  return compressed && compressed.size < source.size ? compressed : source;
}
