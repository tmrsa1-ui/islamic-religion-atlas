import { feature } from "topojson-client";
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

export function buildGlobeData() {
  const fc: any = feature(topo, topo.objects.countries);
  const land: any = feature(landTopo, landTopo.objects.land);
  const items = countries.map((c) => {
    const f = fc.features.find((x: any) => String(x.id).padStart(3, "0") === c.numeric);
    return { iso3: c.iso3, ar: c.name.ar, en: c.name.en, geometry: f ? f.geometry : null, anchor: ANCHORS[c.iso3] || [0, 0] };
  });
  return { land: land.type === "FeatureCollection" ? land.features[0].geometry : land.geometry, items };
}
