"use client";

import React, { useRef, useState } from "react";
import { ImagePlus, Link2, Star, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCEPTED_IMAGE_TYPES, useImageGallery } from "@/lib/use-image-gallery";

type Gallery = ReturnType<typeof useImageGallery>;

export function ImageGalleryField({ gallery, isDe }: { gallery: Gallery; isDe: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [linkInput, setLinkInput] = useState("");

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length > 0) gallery.addFiles(files);
  };

  const handleAddLink = () => {
    if (linkInput.trim() && gallery.addLink(linkInput)) setLinkInput("");
  };

  return (
    <div className="space-y-3 p-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
      {gallery.images.length > 0 ? (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {gallery.images.map((image, index) => (
            <div
              key={image.id}
              className={cn(
                "relative aspect-square rounded-xl overflow-hidden border-2 bg-slate-200",
                image.broken ? "border-red-400" : index === 0 ? "border-[#17b9c1]" : "border-slate-200"
              )}
              title={image.file?.name ?? image.previewUrl}
            >
              <img
                src={image.previewUrl}
                alt={`Photo ${index + 1}`}
                onError={() => gallery.markBroken(image.id)}
                className="h-full w-full object-cover"
              />
              {image.broken ? (
                <span className="absolute inset-x-0 bottom-0 bg-red-500/90 text-[9px] font-bold text-white text-center py-0.5">
                  {isDe ? "Lädt nicht" : "Not loading"}
                </span>
              ) : index === 0 ? (
                <span className="absolute inset-x-0 bottom-0 bg-[#17b9c1]/90 text-[9px] font-bold text-white text-center py-0.5">
                  {isDe ? "Titelbild" : "Cover"}
                </span>
              ) : (
                <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1 text-[9px] font-bold text-white">
                  {image.file ? (isDe ? "Datei" : "File") : "Link"}
                </span>
              )}
              <button
                type="button"
                onClick={() => gallery.remove(image.id)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer"
                title={isDe ? "Entfernen" : "Remove"}
              >
                <X className="w-3 h-3" />
              </button>
              {index > 0 && !image.broken && (
                <button
                  type="button"
                  onClick={() => gallery.makeCover(image.id)}
                  className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/60 hover:bg-amber-500 text-white flex items-center justify-center cursor-pointer"
                  title={isDe ? "Als Titelbild verwenden" : "Make cover photo"}
                >
                  <Star className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-6 rounded-xl border border-dashed border-slate-300 bg-white hover:border-[#17b9c1] transition-colors flex flex-col items-center gap-1.5 text-slate-500 cursor-pointer"
        >
          <ImagePlus className="w-7 h-7 text-[#17b9c1]" />
          <span className="text-xs font-bold text-slate-700">{isDe ? "Fotos hinzufügen" : "Add photos"}</span>
          <span className="text-[11px]">{isDe ? "Vom Gerät hochladen oder Link einfügen" : "Upload from your device or paste a link"}</span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        onChange={handleFiles}
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={gallery.isFull}
          className="px-4 py-2 bg-white border border-slate-200 hover:border-[#17b9c1] text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <Upload className="w-3.5 h-3.5 text-[#17b9c1]" />
          {isDe ? "Vom Gerät" : "From device"}
        </button>
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="url"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddLink();
                }
              }}
              placeholder={isDe ? "Bild-URL einfügen…" : "Paste image URL…"}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-[#17b9c1] text-slate-700"
            />
          </div>
          <button
            type="button"
            onClick={handleAddLink}
            disabled={!linkInput.trim() || gallery.isFull}
            className="px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isDe ? "Hinzufügen" : "Add"}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>{isDe ? "JPG, PNG, WebP, GIF oder AVIF" : "JPG, PNG, WebP, GIF or AVIF"}</span>
        <span>{gallery.images.length}/{gallery.max}</span>
      </div>

      {gallery.error && (
        <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{gallery.error}</p>
      )}
    </div>
  );
}
