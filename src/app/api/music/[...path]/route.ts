const MUSIC_API = process.env.NEXT_PUBLIC_MUSIC_API || "http://localhost:4000";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = `${MUSIC_API}/${path.join("/")}${new URL(_req.url).search}`;
  const res = await fetch(url, { headers: _req.headers });
  const data = await res.json();
  return Response.json(data);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = `${MUSIC_API}/${path.join("/")}${new URL(req.url).search}`;
  const body = await req.json().catch(() => ({}));
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return Response.json(data);
}
