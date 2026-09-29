"use client";
import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/lib/types";
import type { ListItem } from "./HomeExplorer";

export default function CountryList({ items, locale, placeholder, empty, all, activeIso, onActive }: { items: ListItem[]; locale: Locale; placeholder: string; empty: string; all: string; activeIso?: string | null; onActive?: (iso: string | null) => void }) {
  const [q, setQ] = useState("");
  const [g, setG] = useState<string | null>(null);
  const n = q.trim().toLowerCase();
  const groups = Array.from(new Map(items.map((i) => [i.g, i.gLabel])).entries());
  const shown = items.filter((i) => (!g || i.g === g) && (!n || i.ar.includes(n) || i.en.toLowerCase().includes(n) || i.iso3.toLowerCase().includes(n)));
  return (
    <div>
      <label className="sr-only" htmlFor="cq">{placeholder}</label>
      <input id="cq" className="input" type="search" placeholder={placeholder} value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={locale === "ar" ? "تصفية حسب الأغلبية" : "Filter by largest group"}>
        <button type="button" className="chip" aria-pressed={g === null} onClick={() => setG(null)}>{all}</button>
        {groups.map(([k, label]) => <button key={k} type="button" className="chip" aria-pressed={g === k} onClick={() => setG(g === k ? null : k)}>{label}</button>)}
      </div>
      <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8" aria-live="polite">
        {shown.map((i) => (
          <li key={i.iso3} className={"rule country-row" + (activeIso === i.iso3 ? " is-active" : "")}
            onMouseEnter={() => onActive?.(i.iso3)} onMouseLeave={() => onActive?.(null)} onFocus={() => onActive?.(i.iso3)} onBlur={() => onActive?.(null)}>
            <Link href={`/country/${i.iso3}`} className="block py-3 no-underline">
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-lg">{locale === "ar" ? i.ar : i.en}</span>
                <span className="num text-sm text-limestone/70">{i.iso3}</span>
              </span>
              <span className="flex items-center gap-3 mt-1">
                <span className="mini-bar" aria-hidden><span style={{ width: `${i.pct}%` }} /></span>
                <span className="text-sm text-limestone/75 whitespace-nowrap">{i.top}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="mt-6 text-limestone/70">{empty}</p>}
    </div>
  );
}
