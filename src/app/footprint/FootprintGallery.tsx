"use client";

import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface FootprintGalleryProps {
  images: string[];
  title?: string;
}

export function FootprintGallery({ images, title }: FootprintGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <PhotoProvider
      speed={() => 800}
      easing={(type) =>
        type === 2
          ? "cubic-bezier(0.36, 0, 0.66, -0.56)"
          : "cubic-bezier(0.34, 1.56, 0.64, 1)"
      }
    >
      {images.length === 1 ? (
        <PhotoView src={images[0]}>
          <button className="font-sans text-[.55rem] text-accent hover:text-accent2 transition-colors">
            查看图片 ↗
          </button>
        </PhotoView>
      ) : (
        <div className="flex gap-1">
          <PhotoView src={images[0]}>
            <button className="font-sans text-[.55rem] text-accent hover:text-accent2 transition-colors">
              {images.length}张图片 ↗
            </button>
          </PhotoView>
          {images.slice(1).map((src, i) => (
            <PhotoView key={i} src={src} />
          ))}
        </div>
      )}
    </PhotoProvider>
  );
}
