"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { geoOrthographic, geoPath, geoGraticule10, geoDistance } from "d3-geo";
import type { Locale } from "@/lib/types";

type Item = { iso3: string; ar: string; en: string; geometry: any; anchor: [number, number] };
const S = 600, R = 262, C = S / 2, TILT = -18, START = -12;
const SPEED = 7; // degrees per second: one turn in ~51 s
const RESUME_MS = 1400;
// Faint continent captions so the plate reads as a map.
const CONT: { ar: string; en: string; p: [number, number] }[] = [
  { ar: "أمريكا الشمالية", en: "North America", p: [-102, 48] }, { ar: "أمريكا الجنوبية", en: "South America", p: [-60, -18] },
  { ar: "أوروبا", en: "Europe", p: [18, 55] }, { ar: "أفريقيا", en: "Africa", p: [20, 3] },
  { ar: "آسيا", en: "Asia", p: [92, 46] }, { ar: "أوقيانوسيا", en: "Oceania", p: [134, -25] },
];

type Box = { x: number; y: number; w: number; h: number };
const hit = (a: Box, b: Box) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export default function Globe({ locale, land, borders, items, label, prevLabel, nextLabel, focusIso }: { locale: Locale; land: any; borders: any; items: Item[]; label: string; prevLabel: string; nextLabel: string; focusIso?: string | null }) {
  const [lon, setLon] = useState(START);
  const [active, setActive] = useState<string | null>(null);
  const [width, setWidth] = useState(600);
  const [userPaused, setUserPaused] = useState(false);
  const upRef = useRef(false);
  const [, setVisible] = useState(true);
  const vis = useRef(true);
  const [reducedUI, setReducedUI] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);
  const target = useRef<number | null>(null);
  const lonRef = useRef(START);
  const hover = useRef(false);      // pointer or keyboard focus on the globe
  const dragging = useRef(false);
  const listFocus = useRef(false);  // a country is being inspected from the list
  const resumeAt = useRef(0);
  const moved = useRef(false);
  const drag = useRef<{ x: number; lon: number } | null>(null);

  const holdOff = (ms = RESUME_MS) => { resumeAt.current = performance.now() + ms; };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches; setReducedUI(mq.matches);
    const onMq = () => { reduced.current = mq.matches; setReducedUI(mq.matches); };
    mq.addEventListener?.("change", onMq);
    let raf = 0, last = performance.now(), lastPaint = 0;
    const born = performance.now();
    const minGap = window.innerWidth < 600 ? 80 : 40;
    const tick = (t: number) => {
      const dt = Math.min(0.1, (t - last) / 1000); last = t;
      let next = lonRef.current;
      if (target.current !== null) {
        const diff = target.current - next;
        if (Math.abs(diff) < 0.2) { next = target.current; target.current = null; } else next += diff * Math.min(1, dt * 6);
      } else if (t - born > 800 && !reduced.current && !hover.current && !dragging.current && !listFocus.current && !upRef.current && !document.hidden && vis.current && t >= resumeAt.current) {
        next += dt * SPEED;
      }
      if (next !== lonRef.current) {
        lonRef.current = next;
        if (t - lastPaint > minGap) { lastPaint = t; setLon(next); }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const el = wrap.current;
    const ro = el && typeof ResizeObserver !== "undefined" ? new ResizeObserver((e) => setWidth(e[0].contentRect.width || 600)) : null;
    if (el && typeof IntersectionObserver !== "undefined") { const io = new IntersectionObserver((e) => { vis.current = e[0].isIntersecting; setVisible(e[0].isIntersecting); }); io.observe(el); (el as any).__io = io; }
    if (el && ro) { ro.observe(el); setWidth(el.getBoundingClientRect().width || 600); }
    return () => { cancelAnimationFrame(raf); mq.removeEventListener?.("change", onMq); ro?.disconnect(); (el as any)?.__io?.disconnect(); };
  }, []);

  useEffect(() => {
    if (!focusIso) return;
    const it = items.find((x) => x.iso3 === focusIso); if (!it) return;
    setActive(focusIso); listFocus.current = true;
    const d = ((it.anchor[0] - lonRef.current) % 360 + 540) % 360 - 180;
    target.current = lonRef.current + d;
    return () => { listFocus.current = false; holdOff(); setActive(null); };
  }, [focusIso, items]);

  const onDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, lon: lonRef.current }; moved.current = false; target.current = null; hover.current = true; };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current; if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5 && !moved.current) { moved.current = true; dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); }
    if (moved.current) { const k = 360 / (e.currentTarget.getBoundingClientRect().width * 0.9); lonRef.current = d.lon - dx * k; setLon(lonRef.current); }
  };
  const onUp = (e: React.PointerEvent) => {
    const wasMoved = moved.current; drag.current = null; dragging.current = false; holdOff();
    if (e.pointerType !== "mouse") hover.current = false; // touch has no hover: resume after release
    if (wasMoved) setTimeout(() => { moved.current = false; }, 60);
  };

  const proj = useMemo(() => geoOrthographic().translate([C, C]).scale(R).clipAngle(90).rotate([-lon, TILT, 0]), [lon]);
  const path = useMemo(() => geoPath(proj.precision(1.6)).digits(0), [proj]);
  const grat = useMemo(() => path(geoGraticule10()) || "", [path]);
  const landD = useMemo(() => path(land) || "", [path, land]);
  const bordD = useMemo(() => path(borders) || "", [path, borders]);
  const center: [number, number] = [-proj.rotate()[0], -proj.rotate()[1]];

  const name = (i: Item) => (locale === "ar" ? i.ar : i.en);
  const fs = Math.max(13, Math.min(24, (12.5 * S) / Math.max(width, 200))); // ~12.5 screen px
  // Label placement with greedy collision avoidance, nearest-to-centre first.
  const labels = useMemo(() => {
    const vis = items.map((i) => ({ i, d: geoDistance(i.anchor, center), p: proj(i.anchor) }))
      .filter((v) => v.p && v.d < 1.3).sort((a, b) => a.d - b.d);
    const placed: Box[] = vis.map((v) => ({ x: v.p![0] - 9, y: v.p![1] - 9, w: 18, h: 18 }));
    const out: Record<string, { x: number; y: number; w: number; h: number; op: number } | null> = {};
    for (const v of vis) {
      const [x, y] = v.p!; const txt = name(v.i);
      const w = txt.length * fs * (locale === "ar" ? 0.52 : 0.5) + 10, h = fs + 6;
      const cands: Box[] = [
        { x: x - w / 2, y: y + 10, w, h }, { x: x - w / 2, y: y - 10 - h, w, h },
        { x: x + 11, y: y - h / 2, w, h }, { x: x - 11 - w, y: y - h / 2, w, h },
        { x: x - w / 2, y: y + 10 + h, w, h }, { x: x - w / 2, y: y - 10 - 2 * h, w, h },
      ];
      const ok = cands.find((b) => b.x > 4 && b.x + b.w < S - 4 && b.y > 4 && b.y + b.h < S - 4 && !placed.some((q) => hit(b, q)));
      if (ok) { placed.push(ok); out[v.i.iso3] = { ...ok, op: v.d < 1.0 ? 1 : Math.max(0, (1.3 - v.d) / 0.3) }; } else out[v.i.iso3] = null;
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proj, fs, locale, items]);
  const conts = useMemo(() => CONT.map((c) => ({ c, d: geoDistance(c.p, center), p: proj(c.p) })).filter((v) => v.p && v.d < 1.05), [proj]); // eslint-disable-line react-hooks/exhaustive-deps

  const rotate = (deg: number) => { target.current = (target.current ?? lonRef.current) + deg; holdOff(2500); };

  return (
    <div ref={wrap} className="globe-wrap" data-testid="globe" data-lon={lon.toFixed(1)}
      onMouseEnter={() => { hover.current = true; }} onMouseLeave={() => { if (!drag.current) { hover.current = false; holdOff(); } setActive(null); }}
      onFocus={() => { hover.current = true; }} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) { hover.current = false; holdOff(); setActive(null); } }}>
      <svg viewBox={`0 0 ${S} ${S}`} role="group" aria-label={label} className="globe-svg" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        onClickCapture={(e) => { if (moved.current) { e.preventDefault(); e.stopPropagation(); } }}>
        <defs>
          <radialGradient id="g-ocean" cx="34%" cy="30%" r="80%">
            <stop offset="0" stopColor="#1A2332" /><stop offset=".62" stopColor="#101822" /><stop offset="1" stopColor="#07090C" />
          </radialGradient>
          <radialGradient id="g-halo" cx="50%" cy="50%" r="50%">
            <stop offset=".86" stopColor="#2E7A63" stopOpacity=".2" /><stop offset=".93" stopColor="#1A2332" stopOpacity=".45" /><stop offset="1" stopColor="#07090C" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="g-term" x1="0" y1="0" x2="1" y2=".25">
            <stop offset="0" stopColor="#E7E2D8" stopOpacity=".07" /><stop offset=".45" stopColor="#07090C" stopOpacity="0" /><stop offset="1" stopColor="#07090C" stopOpacity=".72" />
          </linearGradient>
          <radialGradient id="g-limb" cx="50%" cy="50%" r="50%">
            <stop offset=".9" stopColor="#E7E2D8" stopOpacity="0" /><stop offset=".985" stopColor="#E7E2D8" stopOpacity=".16" /><stop offset="1" stopColor="#E7E2D8" stopOpacity=".05" />
          </radialGradient>
          <clipPath id="g-clip"><circle cx={C} cy={C} r={R} /></clipPath>
        </defs>
        <circle cx={C} cy={C} r={R + 30} fill="url(#g-halo)" />
        <circle cx={C} cy={C} r={R} fill="url(#g-ocean)" />
        <g clipPath="url(#g-clip)">
          <path d={grat} className="globe-grat" />
          <path d={landD} className="globe-land" />
          <path d={bordD} className="globe-borders" />
          {items.map((i) => {
            const d = i.geometry ? path(i.geometry) : null; if (!d) return null;
            return (
              <Link key={i.iso3} href={`/country/${i.iso3}`} tabIndex={-1} aria-hidden="true" className="globe-area"
                onMouseEnter={() => setActive(i.iso3)} onMouseLeave={() => setActive(null)}>
                <path d={d} className={"globe-country" + (active === i.iso3 ? " on" : "")} />
              </Link>
            );
          })}
        </g>
        <circle cx={C} cy={C} r={R} fill="url(#g-term)" pointerEvents="none" />
        <circle cx={C} cy={C} r={R} fill="url(#g-limb)" pointerEvents="none" />
        <circle cx={C} cy={C} r={R} className="globe-rim" />
        <g pointerEvents="none" aria-hidden="true">
          {conts.map(({ c, d, p }) => (
            <text key={c.en} x={p![0]} y={p![1]} textAnchor="middle" className="globe-cont" style={{ fontSize: fs * 0.82, opacity: Math.max(0, (1.05 - d) / 0.4) * 0.55 }}>{locale === "ar" ? c.ar : c.en}</text>
          ))}
        </g>
        {items.map((i) => {
          const d = geoDistance(i.anchor, center);
          if (d > 1.38) return null;
          const p = proj(i.anchor); if (!p) return null;
          const on = active === i.iso3;
          const L = labels[i.iso3];
          return (
            <Link key={i.iso3} href={`/country/${i.iso3}`} aria-label={name(i)} className="globe-mark" data-iso={i.iso3}
              onMouseEnter={() => setActive(i.iso3)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(i.iso3)} onBlur={() => setActive(null)}>
              <g className={on ? "on" : ""}>
                {L && <g style={{ opacity: on ? 1 : L.op }} className="globe-label">
                  {on && <rect x={L.x - 3} y={L.y} width={L.w + 6} height={L.h} rx="1" className="tag" />}
                  <text x={L.x + L.w / 2} y={L.y + L.h / 2 + fs * 0.34} textAnchor="middle" style={{ fontSize: fs }} className="lbl">{name(i)}</text>
                </g>}
                <g transform={`translate(${p[0].toFixed(1)} ${p[1].toFixed(1)})`} style={{ opacity: d < 1.25 ? 1 : Math.max(0, (1.38 - d) / 0.13) }}>
                  <circle r="16" className="hit" />
                  <circle r={on ? 8.5 : 6} className="ring" />
                  <circle r="2.2" className="core" />
                </g>
              </g>
            </Link>
          );
        })}
      </svg>
      <div className="globe-ctl">
        <button type="button" className="chip" onClick={() => rotate(-35)} aria-label={prevLabel}>{locale === "ar" ? "›" : "‹"}</button>
        <button type="button" className="chip" onClick={() => rotate(35)} aria-label={nextLabel}>{locale === "ar" ? "‹" : "›"}</button>
      </div>
      {!reducedUI && <button type="button" className="chip globe-pause" aria-pressed={userPaused} onClick={() => { upRef.current = !upRef.current; setUserPaused(upRef.current); }}>{userPaused ? (locale === "ar" ? "تشغيل الدوران" : "Resume rotation") : (locale === "ar" ? "إيقاف الدوران" : "Pause rotation")}</button>}
      {reducedUI && <p className="sr-only">{locale === "ar" ? "الدوران التلقائي متوقف بحسب إعداد تقليل الحركة." : "Auto-rotation is off (reduced motion)."}</p>}
    </div>
  );
}
