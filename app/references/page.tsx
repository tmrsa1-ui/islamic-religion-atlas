import { references } from "@/lib/data";
import { getLocale, u } from "@/lib/i18n";

export default function Refs() {
  const locale = getLocale();
  return (
    <div className="px-6">
      <div className="mx-auto max-w-6xl paper sheet mt-6 p-6 md:p-12">
        <p className="folio">{references.length} · Bathel 2026 · 03</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-semibold">{u("refs_title", locale)}</h1>
        <p className="mt-2 max-w-2xl">{u("refs_intro", locale)}</p>
        <div className="refs-wrap mt-8">
          <table className="refs">
            <thead><tr><th>{u("col_statement", locale)}</th><th className="num">{u("col_year", locale)}</th><th>{u("col_publisher", locale)}</th><th>{u("col_link", locale)}</th></tr></thead>
            <tbody>
              {references.map((r) => (
                <tr key={r.claim_id} id={r.claim_id}>
                  <td>{locale === "ar" ? r.statement_ar : r.statement_en}<div className="latin text-xs text-ink/60 mt-1" dir="ltr">{r.claim_id}</div></td>
                  <td className="num">{r.year ?? <span className="missing">{u("no_year", locale)}</span>}</td>
                  <td className="latin">{r.publisher}</td>
                  <td><a className="latin underline" href={r.url} target="_blank" rel="noopener noreferrer">{u("open", locale)}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
