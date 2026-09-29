import { buildGlobeData } from "@/lib/geo";

export const dynamic = "force-static";
// Geometry for the interactive globe, fetched after first paint (kept out of the home HTML).
export function GET() {
  const d = buildGlobeData();
  const geoms: Record<string, unknown> = {};
  d.items.forEach((i) => { geoms[i.iso3] = i.geometry; });
  return new Response(JSON.stringify({ land: d.land, borders: d.borders, geoms }), {
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=86400, stale-while-revalidate=604800" },
  });
}
