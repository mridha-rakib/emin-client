"use client";

import { useEffect, useRef, useState } from "react";
import { ImageFolder, uploadImage } from "@/lib/api";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SOURCE_IMAGE_BYTES = 20 * 1024 * 1024;

export type GalleryImage = {
  id: string;
  previewUrl: string;
  file?: File;
  broken?: boolean;
};

const newImageId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const revoke = (image: GalleryImage) => {
  if (image.file) URL.revokeObjectURL(image.previewUrl);
};

/**
 * Collects listing photos from local files and pasted links. Local files stay in the browser
 * until `uploadAll`, which sends them to S3 and returns the final URLs in gallery order.
 */
export function useImageGallery({ max = 10, isDe = false }: { max?: number; isDe?: boolean } = {}) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [error, setError] = useState("");
  const imagesRef = useRef<GalleryImage[]>([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => () => imagesRef.current.forEach(revoke), []);

  const append = (added: GalleryImage[]) => {
    const room = max - images.length;
    if (room <= 0) {
      added.forEach(revoke);
      setError(isDe ? `Maximal ${max} Fotos erlaubt.` : `You can add up to ${max} photos.`);
      return false;
    }
    const accepted = added.slice(0, room);
    added.slice(room).forEach(revoke);
    if (accepted.length < added.length) {
      setError(isDe ? `Nur ${max} Fotos erlaubt – überzählige wurden ignoriert.` : `Only ${max} photos allowed – the extra ones were skipped.`);
    }
    setImages((current) => [...current, ...accepted]);
    return true;
  };

  const addFiles = (files: File[]) => {
    setError("");
    const valid = files.filter((file) => ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_SOURCE_IMAGE_BYTES);
    if (valid.length < files.length) {
      setError(isDe ? "Einige Dateien wurden übersprungen (nur JPG, PNG, WebP, GIF, AVIF bis 20 MB)." : "Some files were skipped (only JPG, PNG, WebP, GIF or AVIF up to 20 MB).");
    }
    if (valid.length === 0) return false;
    return append(valid.map((file) => ({ id: newImageId(), file, previewUrl: URL.createObjectURL(file) })));
  };

  const addLink = (value: string) => {
    setError("");
    let url: URL;
    try {
      url = new URL(value.trim());
    } catch {
      setError(isDe ? "Bitte geben Sie eine gültige Bild-URL ein." : "Please enter a valid image URL.");
      return false;
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      setError(isDe ? "Nur http(s)-Links sind erlaubt." : "Only http(s) links are allowed.");
      return false;
    }
    if (images.some((image) => !image.file && image.previewUrl === url.href)) {
      setError(isDe ? "Dieser Link wurde bereits hinzugefügt." : "This link has already been added.");
      return false;
    }
    return append([{ id: newImageId(), previewUrl: url.href }]);
  };

  const remove = (id: string) => {
    const target = images.find((image) => image.id === id);
    if (target) revoke(target);
    setImages((current) => current.filter((image) => image.id !== id));
    setError("");
  };

  const makeCover = (id: string) => {
    setImages((current) => {
      const target = current.find((image) => image.id === id);
      return target ? [target, ...current.filter((image) => image.id !== id)] : current;
    });
  };

  const markBroken = (id: string) => {
    setImages((current) => current.map((image) => image.id === id ? { ...image, broken: true } : image));
  };

  const reset = () => {
    images.forEach(revoke);
    setImages([]);
    setError("");
  };

  const uploadAll = (folder: ImageFolder) =>
    Promise.all(images.map(async (image) => image.file ? (await uploadImage(image.file, folder)).url : image.previewUrl));

  return {
    images,
    error,
    localCount: images.filter((image) => image.file).length,
    hasBroken: images.some((image) => image.broken),
    isFull: images.length >= max,
    max,
    addFiles,
    addLink,
    remove,
    makeCover,
    markBroken,
    reset,
    uploadAll,
  };
}
