import type { Metadata } from "next";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = {
  title: "搜索",
  description: "搜索 Loong·Blog 的全部文章 — 按关键词查找技术笔记与生活记录",
  alternates: { canonical: "https://loongblog.fun/search" },
};

export default function SearchPage() {
  return <SearchClient />;
}
