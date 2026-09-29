"use client";
import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/lib/types";

type Item = { iso3: string; ar: string; en: string; top: string };
export default function CountryList({ items, locale, placeholder, empty }: { items: Item[]; locale: Locale; placeholder: string; empty: string }) {
  const [q, setQ] = useState("");
  const n = q.trim().toLowerCase();
  const shown = items.filter((i) => !n || i.ar.includes(n) || i.en.toLowerCase().includes(n) || i.iso3.toLowerCase().includes(n));
  return (
    <div>
      <label className="sr-only" htmlFor="cq">{placeholder}</label>
      <input id="cq" className="input" type="search" placeholder={placeholder} value={q} onChange={(e) => setQ(e.target.value)} />
      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6" aria-live="polite">
        {shown.map((i) => (
          <li key={i.iso3} className="rule">
            <Link href={`/country/${i.iso3}`} className="flex items-baseline justify-between py-3 hover:text-white">
              <span className="text-lg">{locale === "ar" ? i.ar : i.en}</span>
              <span className="latin text-sm text-limestone/60">{i.iso3} · {i.top}</span>
            </Link>
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="mt-6 text-limestone/70">{empty}</p>}
    </div>
  );
}
