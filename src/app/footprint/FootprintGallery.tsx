"use client";

import { useState } from "react";
import { ImageViewer } from "@/components/ui/ImageViewer";

interface FootprintGalleryProps {
  images: string[];
  title?: string;
}

export function FootprintGallery({ images, title }: FootprintGalleryProps) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <>
        <button
          onClick={() => setViewerIndex(0)}
          className="font-sans text-[.55rem] text-accent hover:text-accent2 transition-colors bg-transparent border-none cursor-pointer"
        >
          查看图片 ↗
        </button>
        {viewerIndex !== null && (
          <ImageViewer images={images} index={viewerIndex} onClose={() => setViewerIndex(null)} />
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setViewerIndex(0)}
        className="font-sans text-[.55rem] text-accent hover:text-accent2 transition-colors bg-transparent border-none cursor-pointer"
      >
        {images.length}张图片 ↗
      </button>
      {viewerIndex !== null && (
        <ImageViewer images={images} index={viewerIndex} onClose={() => setViewerIndex(null)} />
      )}
    </>
  );
}
