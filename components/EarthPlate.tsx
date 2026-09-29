import Link from "next/link";
import { buildPlate } from "@/lib/geo";
import { countries } from "@/lib/data";
import type { Locale } from "@/lib/types";
import { u } from "@/lib/i18n";

export default function EarthPlate({ locale }: { locale: Locale }) {
  const p = buildPlate();
  return (
    <div className="plate-wrap hidden md:block">
      <svg viewBox="0 0 960 500" role="img" aria-label={u("plate_alt", locale)} className="w-full h-auto">
        <path d={p.sphere} className="plate-sphere" />
        <path d={p.graticule} className="plate-grat" />
        <path d={p.land} className="plate-land" />
        {p.lit.map((c) => {
          const co = countries.find((x) => x.iso3 === c.iso3)!;
          return (
            <Link key={c.iso3} href={`/country/${c.iso3}`} aria-label={co.name[locale]}>
              <path d={c.d} className="plate-lit"><title>{co.name[locale]}</title></path>
            </Link>
          );
        })}
      </svg>
    </div>
  );
}
