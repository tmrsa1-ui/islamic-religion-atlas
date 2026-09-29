"use client";
import { useEffect, useMemo, useState } from "react";

type Row = { id: string; text: string; year: number | null; publisher: string; url: string; kind: string };
export default function RefsTable({ rows, ar, labels }: { rows: Row[]; ar: boolean; labels: { search: string; all: string; statement: string; year: string; publisher: string; link: string; open: string; noYear: string; shown: string; kinds: Record<string, string>; arrived: string } }) {
  const [q, setQ] = useState(""); const [k, setK] = useState<string | null>(null); const [hash, setHash] = useState("");
  useEffect(() => { const f = () => setHash(decodeURIComponent(location.hash.slice(1))); f(); window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f); }, []);
  const kinds = useMemo(() => Array.from(new Set(rows.map((r) => r.kind))), [rows]);
  const n = q.trim().toLowerCase();
  const shown = rows.filter((r) => (!k || r.kind === k) && (!n || r.text.toLowerCase().includes(n) || r.publisher.toLowerCase().includes(n) || r.id.includes(n)));
  return (
    <div>
      {hash && rows.some((r) => r.id === hash) && <p className="arrived" role="status">{labels.arrived} <span className="latin" dir="ltr">{hash}</span></p>}
      <label className="sr-only" htmlFor="rq">{labels.search}</label>
      <input id="rq" type="search" className="input paper-input" placeholder={labels.search} value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={labels.search}>
        <button type="button" className="chip chip-paper" aria-pressed={k === null} onClick={() => setK(null)}>{labels.all}</button>
        {kinds.map((x) => <button key={x} type="button" className="chip chip-paper" aria-pressed={k === x} onClick={() => setK(k === x ? null : x)}>{labels.kinds[x]}</button>)}
      </div>
      <p className="mt-3 text-sm opacity-70" aria-live="polite"><span className="num">{shown.length}</span> / <span className="num">{rows.length}</span> {labels.shown}</p>
      <div className="refs-wrap mt-4">
        <table className="refs">
          <thead><tr><th>{labels.statement}</th><th className="num">{labels.year}</th><th>{labels.publisher}</th><th>{labels.link}</th></tr></thead>
          <tbody>{shown.map((r) => (
            <tr key={r.id} id={r.id}>
              <td>{r.text}<div className="latin text-xs text-ink/75 mt-1" dir="ltr">{r.id}</div></td>
              <td className="num" data-label={labels.year}>{r.year ?? <span className="missing">{labels.noYear}</span>}</td>
              <td className="latin" data-label={labels.publisher}>{r.publisher}</td>
              <td data-label={labels.link}><a className="latin underline" href={r.url} target="_blank" rel="noopener noreferrer">{labels.open}</a></td>
            </tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}
