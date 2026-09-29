import Link from "next/link";
import type { Country } from "@/lib/data";
import { groupLabels, missingLabel } from "@/lib/data";
import type { Locale } from "@/lib/types";
import { u } from "@/lib/i18n";

const ORDER = ["christian", "muslim", "unaffiliated", "hindu", "buddhist", "jewish", "other"];
export default function PewBars({ c, locale }: { c: Country; locale: Locale }) {
  const sorted = [...c.composition].sort((a, b) => b.pct - a.pct);
  const hc = c.headcounts_2020_million;
  const heads = ORDER.filter((g) => hc[g] != null);
  return (
    <section aria-labelledby="pew">
      <h2 id="pew" className="text-xl font-semibold">{u("pew_title", locale)}</h2>
      <ul className="mt-5 space-y-4">
        {sorted.map((r, i) => (
          <li key={r.g} className="pew-row">
            <div className="flex justify-between items-baseline gap-4">
              <span>{groupLabels[r.g][locale]}</span>
              <Link href="/references#pew-country-table-2020" className="num pct underline" aria-label={`${r.pct}% — ${u("footer_refs", locale)}`}>{r.pct}%</Link>
            </div>
            <div className="bar-track mt-1" aria-hidden><div className={`bar-fill ${i === 0 ? "top" : ""}`} style={{ width: `${r.pct}%` }} /></div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-limestone/70">
        {u("year", locale)}: 2020 · Pew Research Center, 9 June 2025 ·{" "}
        <Link href="/references#pew-country-table-2020" className="underline">{u("footer_refs", locale)}</Link>
      </p>
      <div className="mt-4 text-sm text-limestone/80">
        <span className="kicker">{u("headcount", locale)}</span>
        {heads.length ? (
          <ul className="mt-1 flex flex-wrap gap-x-5">
            {heads.map((g) => (
              <li key={g}>{groupLabels[g][locale]}: <Link className="num underline" href="/references#pew-country-table-2020">~{hc[g]}</Link> {u("million", locale)}</li>
            ))}
          </ul>
        ) : null}
        {c.total_population_million == null && heads.length === 0 && (
          <p className="mt-1"><span className="missing">{missingLabel[locale]}</span> · <Link className="underline" href="/method">{u("missing_link", locale)}</Link></p>
        )}
      </div>
    </section>
  );
}
