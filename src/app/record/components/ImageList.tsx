"use client";

import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

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
  "object-cover w-full h-full min-w-full min-h-full transition-transform duration-500 group-hover/img:scale-110";
const boxClass =
  "group/img relative overflow-hidden rounded-xl bg-bg-card cursor-pointer border border-border flex items-center justify-center";

export default function ImageList({ list }: ImageListProps) {
  const images = parseImages(list);
  if (!images.length) return null;

  const speed = () => 800;
  const easing = (type: number) =>
    type === 2
      ? "cubic-bezier(0.36, 0, 0.66, -0.56)"
      : "cubic-bezier(0.34, 1.56, 0.64, 1)";

  // Single image: large display
  if (images.length === 1) {
    return (
      <PhotoProvider speed={speed} easing={easing}>
        <PhotoView src={images[0]}>
          <div className={`${boxClass} max-w-md`}>
            <img
              src={images[0]}
              alt="record image"
              className={`${imgClass} max-h-[500px]`}
            />
          </div>
        </PhotoView>
      </PhotoProvider>
    );
  }

  // Two images: side by side
  if (images.length === 2) {
    return (
      <PhotoProvider speed={speed} easing={easing}>
        <div className="grid grid-cols-2 gap-2">
          {images.map((src, i) => (
            <PhotoView key={i} src={src}>
              <div className={`${boxClass} aspect-square`}>
                <img src={src} alt={`record image ${i}`} className={imgClass} />
              </div>
            </PhotoView>
          ))}
        </div>
      </PhotoProvider>
    );
  }

  // Three images: WeChat moments style, left large + right stacked
  if (images.length === 3) {
    return (
      <PhotoProvider speed={speed} easing={easing}>
        <div className="grid grid-cols-3 grid-rows-2 gap-2">
          <PhotoView src={images[0]}>
            <div className={`${boxClass} col-span-2 row-span-2 h-full min-h-0`}>
              <img
                src={images[0]}
                alt="record image 0"
                className={imgClass}
              />
            </div>
          </PhotoView>
          <PhotoView src={images[1]}>
            <div className={`${boxClass} aspect-square`}>
              <img
                src={images[1]}
                alt="record image 1"
                className={imgClass}
              />
            </div>
          </PhotoView>
          <PhotoView src={images[2]}>
            <div className={`${boxClass} aspect-square`}>
              <img
                src={images[2]}
                alt="record image 2"
                className={imgClass}
              />
            </div>
          </PhotoView>
        </div>
      </PhotoProvider>
    );
  }

  // 4+ images: grid (2 cols mobile, 4 cols desktop)
  return (
    <PhotoProvider speed={speed} easing={easing}>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {images.map((src, i) => (
          <PhotoView key={i} src={src}>
            <div className={`${boxClass} aspect-square`}>
              <img src={src} alt={`record image ${i}`} className={imgClass} />
            </div>
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  );
}
