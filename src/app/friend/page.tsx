import type { Metadata } from "next";
import { getLinkList, getLinkTypeList } from "@/api/web";
import { getWebInfo } from "@/api/config";
import { extractFromSettled } from "@/lib/api-helpers";
import type { Web, WebType } from "@/types/web";
import type { WebInfo } from "@/types/config";

export const revalidate = 300;
import { getAuthorInfo } from "@/api/user";
import { FriendClient } from "./FriendClient";

export const metadata: Metadata = { title: "友链" };

export default async function FriendPage() {
  const [listRes, typeRes, webRes, authorRes] = await Promise.allSettled([
    getLinkList(),
    getLinkTypeList(),
    getWebInfo(),
    getAuthorInfo(),
  ]);

  const links: Web[] = extractFromSettled(listRes);
  const types: WebType[] = typeRes.status === "fulfilled"
    ? ((typeRes.value.data as WebType[]) ?? [])
    : [];
  const webData = webRes.status === "fulfilled" ? webRes.value.data : null;
  const webInfo: WebInfo | null = webData && "value" in webData ? (webData as { value: WebInfo }).value : null;
  const author = authorRes.status === "fulfilled" ? authorRes.value.data : null;

  // Group links by type name
  const grouped: Record<string, { order: number; list: Web[] }> = {};
  for (const link of links) {
    const name = link.type?.name || "其他";
    if (!grouped[name]) {
      const found = types.find((t) => t.id === link.typeId);
      grouped[name] = { order: found?.order ?? 999, list: [] };
    }
    grouped[name].list.push(link);
  }
  const sorted = Object.entries(grouped).sort((a, b) => a[1].order - b[1].order);

  return <FriendClient grouped={sorted} webInfo={webInfo} author={author} />;
}
