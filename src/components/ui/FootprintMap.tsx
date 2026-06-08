"use client";

import { useEffect, useRef, useState } from "react";
import { getGaodeMapConfig } from "@/api/config";
import { useLenis } from "@/components/scroll/LenisScrollProvider";

interface FootprintItem {
  id?: number;
  title?: string;
  address?: string;
  position?: string;
  content?: string;
  images?: string[];
  createTime?: string;
}

export function FootprintMap({ items }: { items: FootprintItem[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const lenis = useLenis();

  useEffect(() => {
    if (!mapRef.current || items.length === 0) {
      setStatus("error");
      setErrorMsg("暂无足迹数据");
      return;
    }

    let mapInstance: any = null;

    const initMap = async () => {
      try {
        // 1. Get Gaode config
        const configRes = await getGaodeMapConfig();
        if (configRes.code !== 200 || !configRes.data?.key_code) {
          setStatus("error");
          setErrorMsg("地图配置获取失败");
          return;
        }

        const { key_code, security_code } = configRes.data;

        // 2. Set security config before loading script
        (window as any)._AMapSecurityConfig = { securityJsCode: security_code };

        // 3. Load AMap via script tag
        await new Promise<void>((resolve, reject) => {
          if ((window as any).AMap) { resolve(); return; }
          const script = document.createElement("script");
          script.src = `https://webapi.amap.com/maps?v=2.0&key=${key_code}&plugin=AMap.Scale,AMap.Marker,AMap.InfoWindow`;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("AMap script load failed"));
          document.head.appendChild(script);
        });

        const AMap = (window as any).AMap;
        if (!AMap) {
          setStatus("error");
          setErrorMsg("AMap not available");
          return;
        }

        if (!mapRef.current) { setStatus("error"); return; }

        // 4. Create map
        mapInstance = new AMap.Map(mapRef.current, {
          mapStyle: "amap://styles/grey",
          viewMode: "3D",
          zoom: 4.8,
          center: [105.625368, 37.746599],
        });

        // 5. Info window
        const infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(0, -30),
          autoMove: true,
          anchor: "bottom-center",
          isCustom: true,
        });

        mapInstance.on("click", () => infoWindow.close());

        // 6. Add markers
        const markers: any[] = [];
        items.forEach((data) => {
          if (!data.position) return;
          const coords = data.position.split(",").map(Number);
          if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) return;

          const marker = new AMap.Marker({
            position: coords,
            map: mapInstance,
            content: `
              <div style="display:flex;justify-content:center;align-items:center;background:#fff;width:28px;height:28px;border-radius:50%;overflow:hidden;box-shadow:0 0 8px 2px rgba(255,255,255,0.5);animation:amapPulse 2s infinite;">
                ${data.images?.[0]
                  ? `<img src="${data.images[0]}" style="width:90%;height:90%;border-radius:50%;object-fit:cover;">`
                  : `<span style="font-size:14px">📍</span>`}
              </div>
              <style>@keyframes amapPulse{0%{box-shadow:0 0 5px 1px rgba(255,255,255,0.4)}50%{box-shadow:0 0 12px 3px rgba(255,255,255,0.7)}100%{box-shadow:0 0 5px 1px rgba(255,255,255,0.4)}}</style>
            `,
          });
          markers.push(marker);

          marker.on("click", () => {
            infoWindow.setContent(`
              <div style="border-radius:12px;overflow:hidden;width:240px;margin-top:10px;">
                ${data.images?.[0] ? `
                  <div style="position:relative;width:100%;height:160px;overflow:hidden;">
                    <img src="${data.images[0]}" style="width:100%;height:100%;object-fit:cover;">
                    <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6),transparent);padding:16px;display:flex;flex-direction:column;justify-content:flex-end;">
                      <h3 style="color:#fff;margin:0;font-size:16px;font-weight:600;">${data.title||""}</h3>
                      <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:12px;">${data.address||""}</p>
                    </div>
                  </div>` : `
                  <div style="padding:16px;">
                    <h3 style="margin:0 0 8px;font-size:16px;font-weight:600;">${data.title||""}</h3>
                    <p style="margin:0;font-size:12px;color:#666;">${data.address||""}</p>
                  </div>`}
                ${data.content ? `<div style="padding:0 16px 16px;"><p style="margin:0;font-size:12px;color:#999;line-height:1.5;">${data.content.slice(0,100)}${data.content.length>100?"...":""}</p></div>` : ""}
              </div>
            `);
            infoWindow.open(mapInstance, marker.getPosition());
            mapInstance.setCenter(marker.getPosition());
            mapInstance.setZoom(15);
          });
        });

        if (markers.length > 0) {
          mapInstance.setFitView(markers, false, [50, 50, 50, 50]);
        }

        setStatus("ready");
      } catch (e: any) {
        console.error("Gaode map error:", e);
        setStatus("error");
        setErrorMsg(e?.message || "地图加载失败");
      }
    };

    initMap();

    return () => {
      if (mapInstance) mapInstance.destroy();
    };
  }, [items]);

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-[70vh] min-h-[500px]"
        onMouseEnter={() => lenis?.stop()}
        onMouseLeave={() => lenis?.start()}
      />
      {/* Wheel event listener to block Lenis */}
      {mapRef.current && (
        <WheelBlocker elRef={mapRef} lenis={lenis} />
      )}
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-surface">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            <p className="font-kai text-sm text-text-muted">加载地图中...</p>
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-surface">
          <div className="text-center">
            <span className="font-calligraphy text-4xl text-text-muted/20 mb-2 block">🌍</span>
            <p className="font-kai text-sm text-text-muted/60">{errorMsg || "地图加载失败"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/** Block wheel events from reaching Lenis when cursor is on the map */
function WheelBlocker({ elRef, lenis }: { elRef: React.RefObject<HTMLDivElement | null>; lenis: ReturnType<typeof useLenis> }) {
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.stopPropagation();
      lenis?.stop();
    };
    el.addEventListener("wheel", handler, { passive: false, capture: true });
    return () => el.removeEventListener("wheel", handler, { capture: true } as any);
  }, [lenis]);
  return null;
}
