"use client";
import { useState } from "react";
import type { Locale } from "@/lib/types";
import Globe from "./Globe";
import CountryList from "./CountryList";

export type ListItem = { iso3: string; ar: string; en: string; top: string; g: string; gLabel: string; pct: number };
type Geo = { iso3: string; ar: string; en: string; geometry: any; anchor: [number, number] };

export default function HomeExplorer(p: { locale: Locale; land: any; geo: Geo[]; items: ListItem[]; label: string; placeholder: string; empty: string; all: string; hint: string; prevLabel: string; nextLabel: string }) {
  const [focus, setFocus] = useState<string | null>(null);
  return (
    <div className="explorer">
      <figure className="plate plate-wrap globe-figure">
        <Globe locale={p.locale} land={p.land} items={p.geo} label={p.label} focusIso={focus} prevLabel={p.prevLabel} nextLabel={p.nextLabel} />
        <figcaption className="mt-3 pt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm text-limestone/70">
          <span>{p.hint}</span>
          <span className="folio">Pew 2020</span>
        </figcaption>
      </figure>
      <div className="explorer-list">
        <CountryList items={p.items} locale={p.locale} placeholder={p.placeholder} empty={p.empty} all={p.all} activeIso={focus} onActive={setFocus} />
      </div>
    </div>
  );
}
