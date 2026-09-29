import { references } from "@/lib/data";
import { getLocale, u } from "@/lib/i18n";
import RefsTable from "@/components/RefsTable";

const kindOf = (id: string) => id.startsWith("pew") ? "pew" : id.startsWith("quran") ? "quran" : /official/.test(id) ? "centre" : "study";
export default function Refs() {
  const locale = getLocale(); const ar = locale === "ar";
  const rows = references.map((r) => ({ id: r.claim_id, text: ar ? r.statement_ar : r.statement_en, year: r.year ?? null, publisher: r.publisher, url: r.url, kind: kindOf(r.claim_id) }));
  const kinds = ar ? { pew: "Pew", quran: "النص القرآني", centre: "مراكز رسمية", study: "دراسات" } : { pew: "Pew", quran: "Qur'anic text", centre: "Official sites", study: "Studies" };
  return (
    <div className="px-6">
      <div className="mx-auto max-w-6xl paper sheet mt-6 p-6 md:p-12">
        <p className="folio">{references.length} · Bathel 2026 · 03</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-semibold">{u("refs_title", locale)}</h1>
        <p className="mt-2 max-w-2xl">{u("refs_intro", locale)}</p>
        <div className="mt-8">
          <RefsTable rows={rows} ar={ar} labels={{ search: ar ? "ابحث في المراجع" : "Search the references", all: ar ? "الكل" : "All", statement: u("col_statement", locale), year: u("col_year", locale), publisher: u("col_publisher", locale), link: u("col_link", locale), open: u("open", locale), noYear: u("no_year", locale), shown: ar ? "مرجعاً معروضاً" : "references shown", kinds, arrived: ar ? "وصلت من نسبة أو رابط مصدر؛ الصف المطلوب مظلَّل:" : "You arrived from a percentage or source link; the row is highlighted:" }} />
        </div>
      </div>
    </div>
  );
}
