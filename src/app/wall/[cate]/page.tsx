import { getWallCateList, getWallPaging, getWallCatePaging } from "@/api/wall";
import type { Wall, WallCate } from "@/types/wall";
import { WallClient } from "./WallClient";
import type { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ cate: string }> }): Promise<Metadata> {
  const params = await props.params;
  const cateSlug = params.cate;

  try {
    const cateRes = await getWallCateList();
    const cateList: WallCate[] = cateRes.code === 200 && Array.isArray(cateRes.data) ? cateRes.data : [];
    const matched = cateList.find((c) => c.mark === cateSlug);

    if (matched) {
      return {
        title: matched.name || "留言墙",
        description: `${matched.name || "留言墙"} — Loong·Blog`,
      };
    }
  } catch {}

  return {
    title: cateSlug === "all" ? "留言墙" : "留言墙",
    description: "留言墙 — Loong·Blog",
  };
}

export default async function WallPage(props: { params: Promise<{ cate: string }> }) {
  const params = await props.params;
  const cateSlug = params.cate;

  const cateRes = await getWallCateList();
  const cateList: WallCate[] = cateRes.code === 200 && Array.isArray(cateRes.data) ? cateRes.data : [];

  const matchedCate = cateList.find((c) => c.mark === cateSlug);
  const cateId = matchedCate?.id;

  let initialWalls: Wall[] = [];
  if (cateSlug === "all" || !cateId) {
    const wallRes = await getWallPaging(1, 12);
    if (wallRes.code === 200 && wallRes.data) {
      initialWalls = wallRes.data.result ?? [];
    }
  } else {
    const wallRes = await getWallCatePaging(cateId, 1, 12);
    if (wallRes.code === 200 && wallRes.data) {
      initialWalls = wallRes.data.result ?? [];
    }
  }

  return (
    <WallClient
      cateSlug={cateSlug}
      cateList={cateList}
      initialWalls={initialWalls}
    />
  );
}
