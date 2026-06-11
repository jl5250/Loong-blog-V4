import type { Metadata } from "next";
import FishpondClient from "./FishpondClient";

export const metadata: Metadata = {
  title: "鱼塘",
  description: "鱼塘 — Loong·Blog 的 RSS 订阅源",
  alternates: { canonical: "https://loongblog.fun/fishpond" },
};

export default function FishpondPage() {
  return <FishpondClient />;
}
