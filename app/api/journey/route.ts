import { NextResponse } from "next/server";
import { runJourney } from "@/lib/journey";

export const dynamic = "force-dynamic";
const H = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "content-type" };

export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: H }); }

export async function POST(req: Request) {
  let body: any = {};
  try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid_json" }, { status: 400, headers: H }); }
  const r = runJourney({ iso3: body?.iso3, background: body?.background, question: body?.question });
  if ("error" in r) return NextResponse.json({ error: r.error }, { status: r.status, headers: H });
  return NextResponse.json(r, { headers: H });
}

export async function GET() {
  return NextResponse.json({ usage: "POST /api/journey { iso3, background?, question? }" }, { headers: H });
}
