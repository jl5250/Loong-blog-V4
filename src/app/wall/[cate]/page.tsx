import { getWallCateList, getWallPaging, getWallCatePaging } from "@/api/wall";
import { WallClient } from "./WallClient";

export default async function WallPage(props: { params: Promise<{ cate: string }> }) {
  const params = await props.params;
  const cateSlug = params.cate;

  const cateRes = await getWallCateList();
  const cateList = cateRes.code === 200 && Array.isArray(cateRes.data) ? cateRes.data : [];

  // Find cateId from slug, fetch category-specific walls
  const matchedCate = cateList.find((c) => c.mark === cateSlug);
  const cateId = matchedCate?.id;

  let initialWalls: any[] = [];
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
