import EarthPlate from "@/components/EarthPlate";
import CountryList from "@/components/CountryList";
import { countries, groupLabels } from "@/lib/data";
import { getLocale, u } from "@/lib/i18n";

export default function Home() {
  const locale = getLocale();
  const items = countries.map((c) => {
    const top = [...c.composition].sort((a, b) => b.pct - a.pct)[0];
    return { iso3: c.iso3, ar: c.name.ar, en: c.name.en, top: `${groupLabels[top.g][locale]} ${top.pct}%` };
  });
  return (
    <div className="px-6">
      <section className="mx-auto max-w-6xl pt-10 md:pt-16">
        <p className="kicker">Bathel 2026 · 03</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-bold leading-tight">{u("title", locale)}</h1>
        <p className="mt-6 max-w-2xl text-lg md:text-xl text-limestone/85">{u("tagline", locale)}</p>
      </section>
      <section className="mx-auto max-w-6xl mt-12">
        <EarthPlate locale={locale} />
      </section>
      <section className="mx-auto max-w-6xl mt-10" id="countries">
        <h2 className="text-2xl font-bold mb-4">{u("choose", locale)}</h2>
        <CountryList items={items} locale={locale} placeholder={u("search", locale)} empty={u("noresults", locale)} />
      </section>
    </div>
  );
}
