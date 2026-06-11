import type { Metadata } from "next";
import RecordClient from "./RecordClient";

export const metadata: Metadata = {
  title: "说说",
  description: "说说 — Loong·Blog 的墨点时间轴",
  alternates: { canonical: "https://loongblog.fun/record" },
};

export default function RecordPage() {
  return <RecordClient />;
}
