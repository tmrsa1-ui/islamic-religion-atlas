"use client";
import { useState } from "react";

export type SheetText = { title: string; consent: string[]; tasks: { t: string; ok: string }[]; obs: string[]; copy: string; copied: string; print: string; note: string };

export default function TestSheet({ s, ar }: { s: SheetText; ar: boolean }) {
  const [done, setDone] = useState(false);
  const plain = () => [s.title, "", ...s.consent.map((c) => "- " + c), "", ...s.tasks.map((t, i) => `${i + 1}. ${t.t}\n   ${t.ok}`), "", s.obs.join(" | ")].join("\n");
  const copy = async () => { try { await navigator.clipboard.writeText(plain()); setDone(true); setTimeout(() => setDone(false), 2500); } catch { /* clipboard unavailable */ } };
  return (
    <div className="sheet-box" id="test-sheet">
      <div className="sheet-actions no-print">
        <button type="button" className="chip" onClick={copy}>{done ? s.copied : s.copy}</button>
        <button type="button" className="chip" onClick={() => window.print()}>{s.print}</button>
      </div>
      <h3 className="text-xl font-semibold">{s.title}</h3>
      <p className="kicker mt-4">{ar ? "الموافقة وعدم التتبع" : "Consent and no tracking"}</p>
      <ul className="mt-2 space-y-2">{s.consent.map((c) => <li key={c} className="rule pt-2">{c}</li>)}</ul>
      <p className="kicker mt-6">{ar ? "المهام الثلاث" : "The three tasks"}</p>
      <ol className="mt-2 space-y-3">{s.tasks.map((t, i) => (
        <li key={i} className="rule pt-2"><span className="num me-2">{i + 1}.</span>{t.t}<div className="text-sm opacity-80 mt-1">{t.ok}</div></li>
      ))}</ol>
      <p className="kicker mt-6">{ar ? "ما يدوّنه الميسّر لكل قارئ (بخط اليد، بلا اسم)" : "What the facilitator writes per reader (by hand, no name)"}</p>
      <table className="obs"><thead><tr>{s.obs.map((o) => <th key={o}>{o}</th>)}</tr></thead>
        <tbody>{[1, 2, 3].map((n) => <tr key={n}>{s.obs.map((o) => <td key={o}>&nbsp;</td>)}</tr>)}</tbody></table>
      <p className="text-sm mt-4 opacity-80">{s.note}</p>
    </div>
  );
}
