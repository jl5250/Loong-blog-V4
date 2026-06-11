import type { Metadata } from "next";
import XueClient from "./XueClient";

export const metadata: Metadata = {
  title: "薛之谦",
  description: "薛之谦音乐致敬页 — Loong·Blog",
  alternates: { canonical: "https://loongblog.fun/xue" },
};

export default function XuePage() {
  return <XueClient />;
}
