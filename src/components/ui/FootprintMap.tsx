"use client";

import { useEffect, useRef, useState } from "react";
import { getGaodeMapConfig } from "@/api/config";

interface FootprintItem {
  id?: number;
  title?: string;
  address?: string;
  position?: string;
  content?: string;
  images?: string[];
  createTime?: number;
}

export function FootprintMap({ items }: { items: FootprintItem[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;

    let mapInstance: any = null;

    // Bubble phase: AMap handles wheel first (on its canvas), then we stop it
    // from reaching Lenis at the document level
    const onWheel = (e: WheelEvent) => e.stopPropagation();
    el.addEventListener("wheel", onWheel);

    const init = async () => {
      try {
        const res = await getGaodeMapConfig();
        if (res.code !== 200 || !res.data?.key_code) { setError(true); return; }

        (window as any)._AMapSecurityConfig = { securityJsCode: res.data.security_code };

        await new Promise<void>((resolve, reject) => {
          if ((window as any).AMap) { resolve(); return; }
          const s = document.createElement("script");
          s.src = `https://webapi.amap.com/maps?v=2.0&key=${res.data.key_code}&plugin=AMap.Scale,AMap.Marker,AMap.InfoWindow`;
          s.async = true;
          s.onload = () => resolve();
          s.onerror = () => reject();
          document.head.appendChild(s);
        });

        const AMap = (window as any).AMap;
        if (!AMap || !el) { setError(true); return; }

        mapInstance = new AMap.Map(el, {
          mapStyle: "amap://styles/grey",
          zoom: 4.5,
          center: [104.0, 35.0],
          viewMode: "2D",
        });

        const infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30), isCustom: true });
        mapInstance.on("click", () => infoWindow.close());

        items.forEach((d) => {
          if (!d.position) return;
          const c = d.position.split(",").map(Number);
          if (c.length !== 2 || isNaN(c[0]) || isNaN(c[1])) return;

          const marker = new AMap.Marker({
            position: c,
            map: mapInstance,
            content: `<div style="width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 0 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:12px">📍</div>`,
          });

          marker.on("click", () => {
            infoWindow.setContent(`<div style="padding:12px;min-width:180px"><b>${d.title||""}</b><br/><span style="color:#999;font-size:12px">${d.address||""}</span></div>`);
            infoWindow.open(mapInstance, marker.getPosition());
          });
        });

        // Don't call setFitView — always keep the China view
      } catch {
        setError(true);
      }
    };

    init();
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (mapInstance) mapInstance.destroy();
    };
  }, [items]);

  if (error) {
    return <div className="w-full h-[500px] rounded-2xl border border-dashed border-border bg-bg-surface flex items-center justify-center"><p className="font-kai text-sm text-text-muted/60">地图加载失败</p></div>;
  }

  return <div ref={mapRef} className="w-full h-[60vh] min-h-[450px]" />;
}
