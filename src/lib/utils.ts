import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Uploads are already resized before they reach S3, so they skip the Next.js optimizer and load straight from the bucket. */
export function isStoredUpload(src: string) {
  return /^https:\/\/[^/]+\.s3\.[^/]+\.amazonaws\.com\//.test(src);
}
