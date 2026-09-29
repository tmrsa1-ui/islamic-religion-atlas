import Link from "next/link";
import { notFound } from "next/navigation";
import { countries, getCountry } from "@/lib/data";
import { runJourney } from "@/lib/journey";
import { getLocale, u } from "@/lib/i18n";
import PewBars from "@/components/PewBars";
import JourneyPanel from "@/components/JourneyPanel";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return countries.map((c) => ({ iso3: c.iso3 })); }

export default function CountryPage({ params }: { params: { iso3: string } }) {
  const c = getCountry(params.iso3);
  if (!c) notFound();
  const locale = getLocale();
  const initial = runJourney({ iso3: c.iso3 });
  if ("error" in initial) notFound();
  return (
    <div className="px-6"><div className="mx-auto max-w-6xl">
      <div className="country-grid mt-8">
      <article className="panel panel-in p-6 md:p-10">
        <Link href="/" className="text-sm text-limestone/80 underline">{u("back", locale)}</Link>
        <p className="folio mt-6">{c.iso3} · Pew 2020</p>
        <h1 className="mt-1 text-4xl md:text-5xl font-semibold">{c.name[locale]}</h1>
        <div className="mt-8"><PewBars c={c} locale={locale} /></div>
        <div className="mt-8"><JourneyPanel initial={initial} locale={locale} /></div>
      </article>
      <aside className="rail" aria-label={locale === "ar" ? "المصادر" : "Sources"}>
        <p className="kicker mb-2">{locale === "ar" ? "للباحث" : "For researchers"}</p>
        <Link href="/references#pew-country-table-2020">{u("footer_refs", locale)} · Pew 2020</Link>
        <Link href="/references">{u("nav_refs", locale)}</Link>
        <Link href="/method">{u("nav_method", locale)}</Link>
        <Link href="/centers">{u("nav_centers", locale)}</Link>
      </aside>
      </div>
    </div></div>
  );
}
