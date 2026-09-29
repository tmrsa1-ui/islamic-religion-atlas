"use client";
import { useEffect, useState, type ComponentType } from "react";
import type { Locale } from "@/lib/types";
import CountryList from "./CountryList";

// d3-geo and the world geometry load after first paint; until then a server-drawn static SVG holds the space (no layout shift).

export type ListItem = { iso3: string; ar: string; en: string; top: string; g: string; gLabel: string; pct: number };
type Meta = { iso3: string; ar: string; en: string; anchor: [number, number] };
type Geo = Meta & { geometry: any };
type Data = { land: any; borders: any; items: Geo[] };

function Placeholder({ d, label, labels }: { d: string; label: string; labels: { iso3: string; name: string; p: [number, number] | null }[] }) {
  return (
    <div className="globe-wrap" data-testid="globe-placeholder">
      <svg viewBox="0 0 600 600" role="img" aria-label={label} className="globe-svg" style={{ cursor: "default" }}>
        <defs>
          <radialGradient id="p-ocean" cx="34%" cy="30%" r="80%"><stop offset="0" stopColor="#1A2332" /><stop offset=".62" stopColor="#101822" /><stop offset="1" stopColor="#07090C" /></radialGradient>
          <radialGradient id="p-halo" cx="50%" cy="50%" r="50%"><stop offset=".86" stopColor="#2E7A63" stopOpacity=".2" /><stop offset=".93" stopColor="#1A2332" stopOpacity=".45" /><stop offset="1" stopColor="#07090C" stopOpacity="0" /></radialGradient>
          <clipPath id="p-clip"><circle cx="300" cy="300" r="262" /></clipPath>
        </defs>
        <circle cx="300" cy="300" r="292" fill="url(#p-halo)" />
        <circle cx="300" cy="300" r="262" fill="url(#p-ocean)" />
        <g clipPath="url(#p-clip)"><path d={d} className="globe-land" /></g>
        <circle cx="300" cy="300" r="262" className="globe-rim" />
        <g aria-hidden="true" className="ph-labels">{labels.map((l) => <text key={l.iso3} x={l.p![0]} y={l.p![1] + 22} textAnchor="middle" className="ph-lbl">{l.name}</text>)}</g>
      </svg>
      <button type="button" className="chip globe-pause" tabIndex={-1} aria-hidden="true" style={{ visibility: "hidden" }}>.</button>
    </div>
  );
}

export default function HomeExplorer(p: { locale: Locale; placeholderD: string; phLabels: { iso3: string; name: string; p: [number, number] | null }[]; geo: Meta[]; items: ListItem[]; label: string; placeholder: string; empty: string; all: string; hint: string; prevLabel: string; nextLabel: string }) {
  const [focus, setFocus] = useState<string | null>(null);
  const [data, setData] = useState<Data | null>(null);
  const [Globe, setGlobe] = useState<ComponentType<any> | null>(null);
  useEffect(() => {
    let dead = false;
    const go = () => {
      Promise.all([import("./Globe"), fetch("/api/globe").then((r) => r.json())]).then(([mod, j]) => {
        if (dead) return;
        setGlobe(() => mod.default);
        setData({ land: j.land, borders: j.borders, items: p.geo.map((m) => ({ ...m, geometry: j.geoms[m.iso3] || null })) });
      }).catch(() => {});
    };
    const ric = (window as any).requestIdleCallback as undefined | ((f: () => void, o?: any) => number);
    let started = false;
    const start = () => { if (started) return; started = true; ric ? ric(go, { timeout: 1500 }) : go(); };
    const t = window.setTimeout(start, 2200);
    const evs = ["pointerdown", "pointermove", "keydown", "touchstart", "scroll"] as const;
    evs.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
    return () => { dead = true; clearTimeout(t); evs.forEach((e) => window.removeEventListener(e, start)); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="explorer">
      <figure className="plate plate-wrap globe-figure">
        {data && Globe ? <Globe locale={p.locale} land={data.land} borders={data.borders} items={data.items} label={p.label} focusIso={focus} prevLabel={p.prevLabel} nextLabel={p.nextLabel} /> : <Placeholder d={p.placeholderD} label={p.label} labels={p.phLabels} />}
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
