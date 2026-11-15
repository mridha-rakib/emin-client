import { compressImage } from "@/lib/compress-image";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? window.localStorage.getItem("auth_token") : null;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.body && !(options.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`API returned ${response.status} ${response.statusText || "response"} from ${API_URL}. Please check the backend server URL.`);
  }

  if (!response.ok) {
    const raw = data && typeof data === "object" && "message" in data ? data.message : null;
    const message = Array.isArray(raw) ? raw.filter((item) => typeof item === "string").join(" ") : raw;
    throw new Error(typeof message === "string" && message ? message : "Request failed");
  }

  return data as T;
}

export type ImageFolder = "products" | "services";

export type UploadedImage = { key: string; url: string; size: number; contentType: string };

const LISTING_IMAGE_MAX_DIMENSION = 1600;
const AVATAR_MAX_DIMENSION = 512;

export async function uploadImage(file: Blob, folder: ImageFolder): Promise<UploadedImage> {
  const body = new FormData();
  body.append("file", await compressImage(file, LISTING_IMAGE_MAX_DIMENSION), "image");
  return apiRequest<UploadedImage>(`/uploads/images?folder=${folder}`, { method: "POST", body });
}

export async function uploadAvatar(file: File): Promise<UploadedImage & { user: { avatar?: string } }> {
  const body = new FormData();
  body.append("file", await compressImage(file, AVATAR_MAX_DIMENSION), "avatar");
  return apiRequest(`/uploads/avatar`, { method: "POST", body });
}

export type ApiPage<T> = {
  items: T[];
  meta: { page: number; limit: number; total: number; pages: number };
};

export const apiUrl = API_URL;

export async function downloadInvoice(id: string, filename?: string) {
  const token = typeof window !== "undefined" ? window.localStorage.getItem("auth_token") : null;
  const response = await fetch(`${API_URL}/invoices/${id}/pdf`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error("The invoice could not be downloaded.");
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename?.toLowerCase().endsWith(".pdf") ? filename : `${filename || "invoice"}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
