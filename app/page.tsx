import EarthPlate from "@/components/EarthPlate";
import { countries, groupLabels } from "@/lib/data";
import { getLocale, u } from "@/lib/i18n";
import Link from "next/link";

export default function Home() {
  const locale = getLocale();
  const items = countries.map((c) => {
    const top = [...c.composition].sort((a, b) => b.pct - a.pct)[0];
    return { iso3: c.iso3, ar: c.name.ar, en: c.name.en, top: `${groupLabels[top.g][locale]} ${top.pct}%`, g: top.g, gLabel: groupLabels[top.g][locale], pct: top.pct };
  });
  return (
    <div className="px-6">
      <section className="mx-auto max-w-6xl pt-10 md:pt-16 hero">
        <p className="kicker">Bathel 2026 · 03</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-tight">{u("title", locale)}</h1>
        <p className="mt-6 max-w-2xl text-lg md:text-xl text-limestone/85">{u("tagline", locale)}</p>
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[.98rem]">
          <Link href="/references" className="lnk-strong">{u("nav_refs", locale)}</Link>
          <Link href="/method" className="lnk-strong">{u("nav_method", locale)}</Link>
          <Link href="/centers" className="lnk-strong">{u("nav_centers", locale)}</Link>
        </p>
      </section>
      <section className="mx-auto max-w-6xl mt-10" id="countries" aria-labelledby="choose">
        <h2 id="choose" className="text-2xl font-semibold mb-6">{u("choose", locale)}</h2>
        <EarthPlate locale={locale} items={items} />
      </section>
    </div>
  );
}
