"use client";

import { X } from "lucide-react";

export default function ImageViewerModal({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-150 select-none cursor-pointer"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        className="relative max-w-5xl max-h-[90vh] flex items-center justify-center cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Enlarged view"
          className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
        />
      </div>
    </div>
  );
}
