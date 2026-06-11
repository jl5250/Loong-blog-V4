import type { Metadata } from "next";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = {
  title: "搜索",
  alternates: { canonical: "https://loongblog.fun/search" },
};

export default function SearchPage() {
  return <SearchClient />;
}
