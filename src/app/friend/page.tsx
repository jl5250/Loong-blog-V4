import type { Metadata } from "next";
import { getLinkList, getLinkTypeList } from "@/api/web";
import { getWebInfo } from "@/api/config";

export const dynamic = "force-dynamic";
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

  const links = listRes.status === "fulfilled" ? (Array.isArray(listRes.value.data) ? listRes.value.data : []) : [];
  const types = typeRes.status === "fulfilled" ? (Array.isArray(typeRes.value.data) ? typeRes.value.data : []) : [];
  const webData = webRes.status === "fulfilled" ? webRes.value.data : null;
  const webInfo = webData && "value" in webData ? (webData as any).value : null;
  const author = authorRes.status === "fulfilled" ? authorRes.value.data : null;

  // Group links by type name
  const grouped: Record<string, { order: number; list: typeof links }> = {};
  for (const link of links) {
    const name = link.type?.name || "其他";
    if (!grouped[name]) {
      const found = types.find((t: any) => t.id === link.typeId);
      grouped[name] = { order: found?.order ?? 999, list: [] };
    }
    grouped[name].list.push(link);
  }
  const sorted = Object.entries(grouped).sort((a, b) => a[1].order - b[1].order);

  return <FriendClient grouped={sorted} webInfo={webInfo} author={author} />;
}
