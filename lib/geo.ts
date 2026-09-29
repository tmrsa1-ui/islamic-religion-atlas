import { feature, mesh } from "topojson-client";
import { geoOrthographic, geoPath } from "d3-geo";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const topo = require("world-atlas/countries-110m.json");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const landTopo = require("world-atlas/land-110m.json");
import { countries } from "./data";

// Hand-set anchors so overseas territories (e.g. French Guiana) do not pull a marker off the mainland.
export const ANCHORS: Record<string, [number, number]> = {
  FRA: [2.5, 46.6], SWE: [16, 62.5], USA: [-98, 39], DEU: [10.4, 51], GBR: [-2, 54], IND: [78, 22],
  JPN: [138, 37], THA: [101, 15], NGA: [8, 9.5], BRA: [-52, -10], EGY: [30, 27], CAN: [-100, 60],
};

// Round to 0.5 degrees and drop repeated points: the 110m data is already coarse, and this cuts the client payload a lot.
const q = (v: number) => Math.round(v * 2) / 2;
function slim(g: any): any {
  if (!g) return g;
  const ring = (r: number[][]) => { const o: number[][] = []; for (const c of r) { const p = [q(c[0]), q(c[1])]; const l = o[o.length - 1]; if (!l || l[0] !== p[0] || l[1] !== p[1]) o.push(p); } return o; };
  const line = (r: number[][]) => ring(r);
  if (g.type === "Polygon") return { type: "Polygon", coordinates: g.coordinates.map(ring).filter((r: any[]) => r.length >= 4) };
  if (g.type === "MultiPolygon") return { type: "MultiPolygon", coordinates: g.coordinates.map((pl: number[][][]) => pl.map(ring).filter((r) => r.length >= 4)).filter((pl: any[]) => pl.length) };
  if (g.type === "MultiLineString") return { type: "MultiLineString", coordinates: g.coordinates.map(line).filter((r: any[]) => r.length >= 2) };
  return g;
}
export function buildGlobeData() {
  const fc: any = feature(topo, topo.objects.countries);
  const land: any = feature(landTopo, landTopo.objects.land);
  const items = countries.map((c) => {
    const f = fc.features.find((x: any) => String(x.id).padStart(3, "0") === c.numeric);
    return { iso3: c.iso3, ar: c.name.ar, en: c.name.en, geometry: f ? slim(f.geometry) : null, anchor: ANCHORS[c.iso3] || [0, 0] };
  });
  const borders: any = mesh(topo, topo.objects.countries, (a: any, b: any) => a !== b);
  return { borders: slim(borders), land: slim(land.type === "FeatureCollection" ? land.features[0].geometry : land.geometry), items };
}

// Light, server-drawn placeholder: one land path at the globe start position, coarse (1 deg), so first paint needs no client geometry.
export function globePlaceholder(lon = -12, tilt = -18) {
  const land: any = feature(landTopo, landTopo.objects.land);
  const g = land.type === "FeatureCollection" ? land.features[0].geometry : land.geometry;
  const coarse = (v: number) => Math.round(v);
  const ring = (r: number[][]) => { const o: number[][] = []; for (const c of r) { const p = [coarse(c[0]), coarse(c[1])]; const l = o[o.length - 1]; if (!l || l[0] !== p[0] || l[1] !== p[1]) o.push(p); } return o; };
  const geom = { type: "MultiPolygon", coordinates: (g.type === "Polygon" ? [g.coordinates] : g.coordinates).map((pl: number[][][]) => pl.map(ring).filter((r) => r.length >= 4)).filter((pl: any[]) => pl.length) } as any;
  const proj = geoOrthographic().translate([300, 300]).scale(262).clipAngle(90).rotate([-lon, tilt, 0]);
  return geoPath(proj).digits(0)(geom) || "";
}
// Client meta without geometry (names + anchors); geometry is fetched after first paint from /api/globe.
export function globeMeta() {
  return countries.map((c) => ({ iso3: c.iso3, ar: c.name.ar, en: c.name.en, anchor: ANCHORS[c.iso3] || ([0, 0] as [number, number]) }));
}

// Labels for the static placeholder: same anchors and start rotation as the interactive globe, so the swap does not move text.
export function placeholderLabels(locale: "ar" | "en", lon = -12, tilt = -18) {
  const proj = geoOrthographic().translate([300, 300]).scale(262).clipAngle(90).rotate([-lon, tilt, 0]);
  return countries.map((c) => ({ iso3: c.iso3, name: c.name[locale], p: proj(ANCHORS[c.iso3] || [0, 0]) as [number, number] | null }))
    .filter((v) => v.p && Math.hypot(v.p[0] - 300, v.p[1] - 300) < 232 && v.iso3 !== "USA" && v.iso3 !== "CAN" && v.iso3 !== "BRA" && v.iso3 !== "JPN" && v.iso3 !== "THA");
}
