"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { geoOrthographic, geoPath, geoGraticule10, geoDistance } from "d3-geo";
import type { Locale } from "@/lib/types";

type Item = { iso3: string; ar: string; en: string; geometry: any; anchor: [number, number] };
const S = 600, R = 262, C = S / 2, TILT = -18, START = -12;

export default function Globe({ locale, land, items, label, prevLabel, nextLabel, focusIso }: { locale: Locale; land: any; items: Item[]; label: string; prevLabel: string; nextLabel: string; focusIso?: string | null }) {
  const [lon, setLon] = useState(START);
  const [active, setActive] = useState<string | null>(null);
  const paused = useRef(false);
  const reduced = useRef(false);
  const target = useRef<number | null>(null);
  const lonRef = useRef(START);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    const onMq = () => { reduced.current = mq.matches; };
    mq.addEventListener?.("change", onMq);
    let raf = 0, last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.1, (t - last) / 1000); last = t;
      let next = lonRef.current;
      if (target.current !== null) {
        const diff = target.current - next;
        if (Math.abs(diff) < 0.2) { next = target.current; target.current = null; } else next += diff * Math.min(1, dt * 6);
      } else if (!paused.current && !reduced.current && !document.hidden) {
        next += dt * 3.2;
      }
      if (next !== lonRef.current) { lonRef.current = next; setLon(next); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); mq.removeEventListener?.("change", onMq); };
  }, []);

  useEffect(() => {
    if (!focusIso) return;
    const it = items.find((x) => x.iso3 === focusIso); if (!it) return;
    setActive(focusIso); paused.current = true;
    let d = ((it.anchor[0] - lonRef.current) % 360 + 540) % 360 - 180;
    target.current = lonRef.current + d;
    return () => { paused.current = false; setActive(null); };
  }, [focusIso, items]);

  const drag = useRef<{ x: number; lon: number; moved: boolean } | null>(null);
  const onDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, lon: lonRef.current, moved: false }; target.current = null; };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current; if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5 && !d.moved) { d.moved = true; e.currentTarget.setPointerCapture(e.pointerId); }
    if (d.moved) { const k = 360 / (e.currentTarget.getBoundingClientRect().width * 0.9); lonRef.current = d.lon - dx * k; setLon(lonRef.current); }
  };
  const onUp = () => { const d = drag.current; drag.current = null; if (d?.moved) setTimeout(() => { moved.current = false; }, 50); };
  const moved = useRef(false);

  const proj = useMemo(() => geoOrthographic().translate([C, C]).scale(R).clipAngle(90).rotate([-lon, TILT, 0]), [lon]);
  const path = useMemo(() => geoPath(proj).digits(1), [proj]);
  const grat = useMemo(() => path(geoGraticule10()) || "", [path]);
  const landD = useMemo(() => path(land) || "", [path, land]);
  const center: [number, number] = [-proj.rotate()[0], -proj.rotate()[1]];

  const rotate = (deg: number) => { target.current = (target.current ?? lonRef.current) + deg; };
  const pause = (p: boolean) => { paused.current = p; };
  const name = (i: Item) => (locale === "ar" ? i.ar : i.en);

  return (
    <div className="globe-wrap" onMouseEnter={() => pause(true)} onMouseLeave={() => { pause(false); setActive(null); }}
      onFocus={() => pause(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) { pause(false); setActive(null); } }}>
      <svg viewBox={`0 0 ${S} ${S}`} role="group" aria-label={label} className="globe-svg" onPointerDown={onDown} onPointerMove={(e) => { onMove(e); if (drag.current?.moved) moved.current = true; }} onPointerUp={onUp} onPointerCancel={onUp} onClickCapture={(e) => { if (moved.current) { e.preventDefault(); e.stopPropagation(); } }}>
        <defs>
          <radialGradient id="g-ocean" cx="34%" cy="30%" r="80%">
            <stop offset="0" stopColor="#1A2332" />
            <stop offset=".62" stopColor="#101822" />
            <stop offset="1" stopColor="#07090C" />
          </radialGradient>
          <radialGradient id="g-halo" cx="50%" cy="50%" r="50%">
            <stop offset=".86" stopColor="#2E7A63" stopOpacity=".2" />
            <stop offset=".93" stopColor="#1A2332" stopOpacity=".45" />
            <stop offset="1" stopColor="#07090C" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="g-term" x1="0" y1="0" x2="1" y2=".25">
            <stop offset="0" stopColor="#E7E2D8" stopOpacity=".07" />
            <stop offset=".45" stopColor="#07090C" stopOpacity="0" />
            <stop offset="1" stopColor="#07090C" stopOpacity=".72" />
          </linearGradient>
          <radialGradient id="g-limb" cx="50%" cy="50%" r="50%">
            <stop offset=".9" stopColor="#E7E2D8" stopOpacity="0" />
            <stop offset=".985" stopColor="#E7E2D8" stopOpacity=".16" />
            <stop offset="1" stopColor="#E7E2D8" stopOpacity=".05" />
          </radialGradient>
          <clipPath id="g-clip"><circle cx={C} cy={C} r={R} /></clipPath>
        </defs>
        <circle cx={C} cy={C} r={R + 30} fill="url(#g-halo)" />
        <circle cx={C} cy={C} r={R} fill="url(#g-ocean)" />
        <g clipPath="url(#g-clip)">
          <path d={grat} className="globe-grat" />
          <path d={landD} className="globe-land" />
          {items.map((i) => { const d = i.geometry ? path(i.geometry) : null; return d ? <path key={i.iso3} d={d} className={"globe-country" + (active === i.iso3 ? " on" : "")} /> : null; })}
        </g>
        <circle cx={C} cy={C} r={R} fill="url(#g-term)" pointerEvents="none" />
        <circle cx={C} cy={C} r={R} fill="url(#g-limb)" pointerEvents="none" />
        <circle cx={C} cy={C} r={R} className="globe-rim" />
        {items.map((i) => {
          if (geoDistance(i.anchor, center) > 1.38) return null;
          const p = proj(i.anchor); if (!p) return null;
          const on = active === i.iso3;
          const w = Math.max(70, name(i).length * 9 + 24);
          return (
            <Link key={i.iso3} href={`/country/${i.iso3}`} aria-label={name(i)} className="globe-mark"
              onMouseEnter={() => setActive(i.iso3)} onFocus={() => setActive(i.iso3)} onBlur={() => setActive(null)}>
              <g transform={`translate(${p[0].toFixed(1)} ${p[1].toFixed(1)})`} className={on ? "on" : ""}>
                <circle r="16" className="hit" />
                <circle r={on ? 9 : 6.5} className="ring" />
                <circle r="2.2" className="core" />
                {on && (<g><rect x={-w / 2} y="-42" width={w} height="24" rx="1" className="tag" /><text y="-25" textAnchor="middle" className="tag-t">{name(i)}</text></g>)}
              </g>
            </Link>
          );
        })}
      </svg>
      <div className="globe-ctl">
        <button type="button" className="chip" onClick={() => rotate(-35)} aria-label={prevLabel}>{locale === "ar" ? "›" : "‹"}</button>
        <button type="button" className="chip" onClick={() => rotate(35)} aria-label={nextLabel}>{locale === "ar" ? "‹" : "›"}</button>
      </div>
    </div>
  );
}
