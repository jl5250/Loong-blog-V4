const MUSIC_API = process.env.NEXT_PUBLIC_MUSIC_API || "http://localhost:4000";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const search = new URL(_req.url).search;
    const url = `${MUSIC_API}/${path.join("/")}${search}`;
    const res = await fetch(url);
    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ code: 500, message: String(e), data: null }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const search = new URL(req.url).search;
    const url = `${MUSIC_API}/${path.join("/")}${search}`;
    const body = await req.json().catch(() => ({}));
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ code: 500, message: String(e), data: null }, { status: 500 });
  }
}
