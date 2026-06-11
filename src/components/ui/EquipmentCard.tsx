"use client";

import { useState } from "react";
import { ImageViewer } from "./ImageViewer";

interface EquipmentItem {
  name: string;
  description: string;
  price: string | number;
  image: string;
  color?: string;
}

export function EquipmentCard({ item }: { item: EquipmentItem }) {
  const [viewerOpen, setViewerOpen] = useState(false);

  return (
    <>
      <div className="group flex flex-col border border-border rounded-2xl overflow-hidden bg-bg-surface hover:border-accent/40 transition-all duration-500 hover:-translate-y-1.5">
        {/* Image area */}
        <div
          className="relative h-48 flex items-center justify-center p-4 overflow-hidden cursor-zoom-in"
          style={{ backgroundColor: item.color || "#2a2a3a" }}
          onClick={() => item.image && setViewerOpen(true)}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-white/5 mix-blend-overlay" />
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              className="relative z-10 h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <span className="relative z-10 font-calligraphy text-4xl text-white/20">
              {item.name[0] || "?"}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-serif font-bold text-sm text-text-body group-hover:text-accent transition-colors">
            {item.name}
          </h3>
          <p className="font-kai text-xs text-text-muted mt-2 line-clamp-2 leading-relaxed flex-1">
            {item.description}
          </p>

          {/* Price */}
          {item.price && Number(item.price) > 0 && (
            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
              <span className="font-sans text-xs text-text-muted font-mono">
                <span className="text-[.5rem] mr-0.5">¥</span>
                {Number(item.price).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {viewerOpen && item.image && (
        <ImageViewer images={[item.image]} index={0} onClose={() => setViewerOpen(false)} />
      )}
    </>
  );
}
