"use client";

import { useState } from "react";
import { ImageViewer } from "@/components/ui/ImageViewer";

interface ImageListProps {
  list: string[];
}

function parseImages(images: string | string[] | null | undefined): string[] {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  try {
    const p = JSON.parse(images);
    return Array.isArray(p) ? p : [images];
  } catch {
    return [images];
  }
}

const imgClass =
  "object-cover w-full h-full min-w-full min-h-full transition-transform duration-500 group-hover/img:scale-110 cursor-pointer";
const boxClass =
  "group/img relative overflow-hidden rounded-xl bg-bg-card border border-border flex items-center justify-center";

export default function ImageList({ list }: ImageListProps) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const images = parseImages(list);
  if (!images.length) return null;

  // Single image: large display
  if (images.length === 1) {
    return (
      <>
        <div className={`${boxClass} max-w-md`} onClick={() => setViewerIndex(0)}>
          <img src={images[0]} alt="record image" className={`${imgClass} max-h-[500px]`} />
        </div>
        {viewerIndex !== null && (
          <ImageViewer images={images} index={viewerIndex} onClose={() => setViewerIndex(null)} />
        )}
      </>
    );
  }

  // Two images
  if (images.length === 2) {
    return (
      <>
        <div className="grid grid-cols-2 gap-2">
          {images.map((src, i) => (
            <div key={i} className={`${boxClass} aspect-square`} onClick={() => setViewerIndex(i)}>
              <img src={src} alt={`record image ${i}`} className={imgClass} />
            </div>
          ))}
        </div>
        {viewerIndex !== null && (
          <ImageViewer images={images} index={viewerIndex} onClose={() => setViewerIndex(null)} />
        )}
      </>
    );
  }

  // Three images: left large + right stacked
  if (images.length === 3) {
    return (
      <>
        <div className="grid grid-cols-3 grid-rows-2 gap-2">
          <div className={`${boxClass} col-span-2 row-span-2 h-full min-h-0`} onClick={() => setViewerIndex(0)}>
            <img src={images[0]} alt="record image 0" className={imgClass} />
          </div>
          <div className={`${boxClass} aspect-square`} onClick={() => setViewerIndex(1)}>
            <img src={images[1]} alt="record image 1" className={imgClass} />
          </div>
          <div className={`${boxClass} aspect-square`} onClick={() => setViewerIndex(2)}>
            <img src={images[2]} alt="record image 2" className={imgClass} />
          </div>
        </div>
        {viewerIndex !== null && (
          <ImageViewer images={images} index={viewerIndex} onClose={() => setViewerIndex(null)} />
        )}
      </>
    );
  }

  // 4+ images: grid
  return (
    <>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {images.map((src, i) => (
          <div key={i} className={`${boxClass} aspect-square`} onClick={() => setViewerIndex(i)}>
            <img src={src} alt={`record image ${i}`} className={imgClass} />
          </div>
        ))}
      </div>
      {viewerIndex !== null && (
        <ImageViewer images={images} index={viewerIndex} onClose={() => setViewerIndex(null)} />
      )}
    </>
  );
}
