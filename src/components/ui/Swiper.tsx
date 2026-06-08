"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";

interface SwiperSlide {
  title: string;
  description: string;
  tag: string;
  image?: string;
}

interface SwiperProps {
  slides: SwiperSlide[];
}

export function Swiper({ slides }: SwiperProps) {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  const goTo = useCallback((i: number, d?: number) => {
    setDir(d ?? (i > current ? 1 : -1));
    setCurrent(((i % slides.length) + slides.length) % slides.length);
  }, [slides.length, current]);

  const next = useCallback(() => { setDir(1); setCurrent((c) => (c + 1) % slides.length); }, [slides.length]);
  const prev = useCallback(() => { setDir(-1); setCurrent((c) => (c - 1 + slides.length) % slides.length); }, [slides.length]);

  useEffect(() => { timer.current = setInterval(next, 5000); return () => clearInterval(timer.current); }, [next]);

  const pause = () => clearInterval(timer.current);
  const resume = () => { timer.current = setInterval(next, 5000); };

  if (slides.length === 0) return null;

  const gBg = "linear-gradient(135deg, #16213e, #1e2248)";

  return (
    <div onMouseEnter={pause} onMouseLeave={resume}>
      <div className="relative rounded-2xl overflow-hidden h-[460px] max-md:h-[300px] group">
        {slides.map((slide, i) => {
          const is = i === current;
          const prevI = (current - 1 + slides.length) % slides.length;
          const nextI = (current + 1) % slides.length;

          // Slide transform: current at center, prev slides out left, next slides in from right
          let tx = "translateX(100%)";
          if (is) tx = "translateX(0)";
          else if (dir === 1 && i === prevI) tx = "translateX(-100%)";
          else if (dir === -1 && i === nextI) tx = "translateX(100%)";
          else if (i < current) tx = "translateX(-100%)";
          else tx = "translateX(100%)";

          return (
            <div
              key={i}
              className="absolute inset-0 bg-cover bg-center cursor-pointer"
              style={{ backgroundImage: slide.image ? undefined : gBg, transform: tx, transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
            >
              {slide.image ? (
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="100vw"
                  className="absolute inset-0 object-cover transition-transform duration-[10s] ease-out"
                  style={{ transform: is ? "scale(1.08)" : "scale(1)" }}
                  priority={i === 0}
                />
              ) : (
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-out"
                  style={{ backgroundImage: gBg, transform: is ? "scale(1.08)" : "scale(1)" }} />
              )}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-primary), transparent 50%)" }} />

              <div className={`absolute -top-20 -right-20 w-80 h-80 rounded-full transition-all duration-1000 ${is ? "opacity-30 scale-100" : "opacity-0 scale-50"}`}
                style={{ background: "radial-gradient(circle, var(--accent-hex) 0%, transparent 70%)" }} />
              <div className={`absolute -bottom-20 -left-20 w-60 h-60 rounded-full transition-all duration-1000 delay-200 ${is ? "opacity-20 scale-100" : "opacity-0 scale-50"}`}
                style={{ background: "radial-gradient(circle, var(--accent2-hex) 0%, transparent 70%)" }} />

              <div className={`absolute bottom-10 left-10 max-md:left-4 max-md:bottom-5 z-2 max-w-[600px] transition-all duration-700 ease-out ${is ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs border mb-2 backdrop-blur-sm"
                  style={{ borderColor: "var(--accent-hex)", color: "var(--accent-hex)", background: "rgba(0,0,0,0.3)" }}>
                  {slide.tag}
                </span>
                <h2 className="font-serif font-bold text-2xl md:text-3xl mb-1 drop-shadow-lg">{slide.title}</h2>
                <p className="text-sm text-text-muted leading-relaxed max-md:text-xs">{slide.description}</p>
              </div>

              {is && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); prev(); }} className="swp-nav left-5 max-md:hidden">‹</button>
                  <button onClick={(e) => { e.stopPropagation(); next(); }} className="swp-nav right-5 max-md:hidden">›</button>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i, i > current ? 1 : -1)}
            className={`h-2 rounded-full transition-all duration-400 ${i === current ? "w-8 bg-accent" : "w-2 bg-border hover:w-3"}`} />
        ))}
      </div>

      <style jsx>{`
        .swp-nav { position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:44px;height:44px;border-radius:50%;border:1px solid var(--border);background:var(--bg-surface);backdrop-filter:blur(12px);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:var(--text-muted);transition:all 0.3s;opacity:0; }
        .group:hover .swp-nav { opacity:1; }
        .swp-nav:hover { background:var(--accent-hex);color:#fff;border-color:var(--accent-hex); }
      `}</style>
    </div>
  );
}
