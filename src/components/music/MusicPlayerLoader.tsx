"use client";

import dynamic from "next/dynamic";

export const MusicPlayer = dynamic(
  () => import("@/components/music/MusicPlayer").then((m) => ({ default: m.MusicPlayer })),
  { ssr: false }
);
