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
    <div className="px-6 panel-in">
      <article className="mx-auto max-w-3xl pt-8">
        <Link href="/" className="underline text-limestone/80">{u("back", locale)}</Link>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold">{c.name[locale]}</h1>
        <p className="latin text-limestone/60">{c.iso3}</p>
        <div className="mt-8"><PewBars c={c} locale={locale} /></div>
        <div className="mt-8"><JourneyPanel initial={initial} locale={locale} /></div>
      </article>
    </div>
  );
}
