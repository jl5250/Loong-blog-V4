import type { ResponseData, Paginate } from "@/types/response";

/**
 * Extract the result array from a paginated API response.
 * Handles both paginated {result: [...]} and direct array responses.
 */
export function extractResult<T>(res: ResponseData<Paginate<T[]> | T[]>): T[] {
  const d = res.data;
  if (Array.isArray(d)) return d;
  if (d && typeof d === "object" && "result" in d) return (d as Paginate<T[]>).result ?? [];
  return [];
}

/**
 * Extract the result array from a PromiseSettledResult of a paginated API response.
 */
export function extractFromSettled<T>(settled: PromiseSettledResult<ResponseData<Paginate<T[]> | T[]>>): T[] {
  if (settled.status !== "fulfilled") return [];
  return extractResult(settled.value);
}
