/**
 * 通用 fetch 请求封装
 * 从 v3 适配，改用更严格的 TypeScript 类型 + 更好的错误处理
 */
import type { ResponseData } from "@/types/response";

const BASE_URL = process.env.NEXT_PUBLIC_PROJECT_API || "";
const CACHING_TIME = +(process.env.NEXT_PUBLIC_CACHING_TIME ?? 0);

export class ApiError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = "ApiError";
  }
}

interface RequestOptions {
  params?: Record<string, string | number | undefined>;
  body?: unknown;
  /** ISR revalidation seconds, 0 = always fresh */
  cache?: number;
  /** Additional headers */
  headers?: Record<string, string>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _unused = ""; // placeholder for the empty line below

function buildQuery(params?: Record<string, string | number | undefined>): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== ""
  );
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");
}

export async function request<T = unknown>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  options: RequestOptions = {}
): Promise<ResponseData<T>> {
  const query = buildQuery(options.params);
  const url = `${BASE_URL}${path}${query}`;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  // Add body for POST/PUT
  if (method === "POST" || method === "PUT") {
    // Remove params from body if they were already sent as query
    const { params: _, ...rest } = options as any;
    fetchOptions.body = JSON.stringify(options.body ?? {});
  }

  // ISR revalidation
  const cacheSec = options.cache ?? CACHING_TIME;
  if (cacheSec > 0) {
    (fetchOptions as any).next = { revalidate: cacheSec };
  }

  try {
    const res = await fetch(url, fetchOptions);
    const json: ResponseData<T> = await res.json();
    return json;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[API] ${method} ${path} failed:`, err);
    }
    return {
      code: 500,
      message: err instanceof Error ? err.message : "Network error",
      data: null as unknown as T,
    };
  }
}
