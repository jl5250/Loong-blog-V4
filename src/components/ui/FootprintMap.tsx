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
  createTime?: string;
}

export function FootprintMap({ items }: { items: FootprintItem[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mapRef.current || items.length === 0) {
      setLoading(false);
      return;
    }

    let mapInstance: any = null;
    let infoWindow: any = null;

    const initMap = async () => {
      try {
        // Get Gaode config
        const configRes = await getGaodeMapConfig();
        if (configRes.code !== 200 || !configRes.data?.key_code) {
          setError(true);
          setLoading(false);
          return;
        }

        const { key_code, security_code } = configRes.data;

        // Set security config
        (window as any)._AMapSecurityConfig = {
          securityJsCode: security_code,
        };

        // Dynamic import AMap loader
        const AMapLoader = await import("@amap/amap-jsapi-loader");

        const AMap = await AMapLoader.load({
          key: key_code,
          version: "2.0",
          plugins: ["AMap.Scale", "AMap.Marker", "AMap.InfoWindow"],
        });

        if (!mapRef.current) {
          setLoading(false);
          return;
        }

        // Create map
        mapInstance = new AMap.Map(mapRef.current, {
          mapStyle: "amap://styles/whitesmoke",
          viewMode: "3D",
          zoom: 4.8,
          center: [105.625368, 37.746599],
          layers: [new AMap.TileLayer.Satellite()],
        });

        // Info window
        infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(0, -30),
          autoMove: true,
          anchor: "bottom-center",
          isCustom: true,
        });

        // Close info window on map click
        mapInstance.on("click", () => {
          infoWindow.close();
        });

        // Add markers
        const markers: any[] = [];
        items.forEach((data) => {
          if (!data.position) return;
          const coords = data.position.split(",").map(Number);
          if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) return;

          const marker = new AMap.Marker({
            position: coords,
            map: mapInstance,
            content: `
              <div style="display: flex; justify-content: center; align-items: center; background-color: #fff; width: 28px; height: 28px; border-radius: 50%; overflow: hidden; box-shadow: 0 0 8px 2px rgba(255,255,255,0.5); animation: amapPulse 2s infinite;">
                ${data.images?.[0]
                  ? `<img src="${data.images[0]}" alt="" style="width: 90%; height: 90%; border-radius: 50%; object-fit: cover;">`
                  : `<span style="font-size:14px">📍</span>`
                }
              </div>
              <style>
                @keyframes amapPulse {
                  0% { box-shadow: 0 0 5px 1px rgba(255,255,255,0.4); }
                  50% { box-shadow: 0 0 12px 3px rgba(255,255,255,0.7); }
                  100% { box-shadow: 0 0 5px 1px rgba(255,255,255,0.4); }
                }
              </style>
            `,
          });

          markers.push(marker);

          marker.on("click", () => {
            const infoContent = `
              <div style="border-radius: 12px; overflow: hidden; width: 240px; margin-top: 10px;">
                ${data.images?.[0] ? `
                  <div style="position: relative; width: 100%; height: 160px; overflow: hidden;">
                    <img src="${data.images[0]}" alt="" style="width: 100%; height: 100%; object-fit: cover;">
                    <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6), transparent); padding: 16px; display: flex; flex-direction: column; justify-content: flex-end;">
                      <h3 style="color: white; margin: 0; font-size: 16px; font-weight: 600;">${data.title || ""}</h3>
                      <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 12px;">${data.address || ""}</p>
                    </div>
                  </div>
                ` : `
                  <div style="padding: 16px;">
                    <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600;">${data.title || ""}</h3>
                    <p style="margin: 0; font-size: 12px; color: #666;">${data.address || ""}</p>
                  </div>
                `}
                ${data.content ? `<div style="padding: 0 16px 16px;"><p style="margin: 0; font-size: 12px; color: #999; line-height: 1.5;">${data.content.slice(0, 100)}${data.content.length > 100 ? "..." : ""}</p></div>` : ""}
              </div>
            `;
            infoWindow.setContent(infoContent);
            infoWindow.open(mapInstance, marker.getPosition());
            mapInstance.setCenter(marker.getPosition());
            mapInstance.setZoom(15);
          });
        });

        // Fit bounds
        if (markers.length > 0) {
          mapInstance.setFitView(markers, false, [50, 50, 50, 50]);
        }

        setLoading(false);
      } catch (e) {
        console.error("Gaode map load failed:", e);
        setError(true);
        setLoading(false);
      }
    };

    initMap();

    return () => {
      if (mapInstance) mapInstance.destroy();
    };
  }, [items]);

  if (error) {
    return (
      <div className="w-full h-[400px] rounded-2xl border border-dashed border-border bg-bg-surface flex items-center justify-center">
        <div className="text-center">
          <span className="font-calligraphy text-4xl text-text-muted/20 mb-2 block">🌍</span>
          <p className="font-kai text-sm text-text-muted/60">地图加载失败，请检查网络或配置</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-[400px] rounded-2xl border border-border bg-bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="font-kai text-xs text-text-muted/60">加载地图中...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full h-[400px] rounded-2xl border border-dashed border-border bg-bg-surface flex items-center justify-center">
        <div className="text-center">
          <span className="font-calligraphy text-4xl text-text-muted/20 mb-2 block">🗺️</span>
          <p className="font-kai text-sm text-text-muted/60">暂无足迹数据</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full h-[450px] rounded-2xl overflow-hidden border border-border"
    />
  );
}
