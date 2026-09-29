import { geoNaturalEarth1, geoPath, geoGraticule10 } from "d3-geo";
import { feature } from "topojson-client";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const topo = require("world-atlas/countries-110m.json");
import { countries } from "./data";

export const PLATE_W = 960, PLATE_H = 500;
export function buildPlate() {
  const fc: any = feature(topo, topo.objects.countries);
  const projection = geoNaturalEarth1().fitExtent([[12, 12], [PLATE_W - 12, PLATE_H - 12]], { type: "Sphere" } as any);
  const path = geoPath(projection).digits(1);
  const pick = new Set(countries.map((c) => c.numeric));
  const land = fc.features.filter((f: any) => !pick.has(String(f.id).padStart(3, "0"))).map((f: any) => path(f)).filter(Boolean).join("");
  const lit = countries.map((c) => {
    const f = fc.features.find((x: any) => String(x.id).padStart(3, "0") === c.numeric);
    const centroid = f ? path.centroid(f) : [0, 0];
    return { iso3: c.iso3, d: f ? path(f) || "" : "", cx: centroid[0], cy: centroid[1] };
  });
  return {
    land,
    lit,
    graticule: path(geoGraticule10()) || "",
    sphere: path({ type: "Sphere" } as any) || "",
  };
}
