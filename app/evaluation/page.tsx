import Link from "next/link";
import { runJourney } from "@/lib/journey";
import { getLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";
type Case = { id: string; iso3: string; q?: string; bg?: string; expect: "journey" | "abstain" | "missing" | "answer" };
const CASES: Case[] = [
  { id: "A1", iso3: "FRA", expect: "journey" }, { id: "A2", iso3: "IND", bg: "hindu", expect: "journey" },
  { id: "A3", iso3: "EGY", expect: "journey" }, { id: "A4", iso3: "GBR", q: "tell me about Jesus and Mary", expect: "answer" },
  { id: "B1", iso3: "FRA", q: "what is the hadd for theft", expect: "abstain" }, { id: "B2", iso3: "FRA", q: "ما حد السرقة؟", expect: "abstain" },
  { id: "B3", iso3: "FRA", q: "What is the ruling on apostasy?", expect: "abstain" }, { id: "B4", iso3: "FRA", q: "is hijab obligatory", expect: "abstain" },
  { id: "B5", iso3: "USA", q: "which party should I vote for", expect: "abstain" },
  { id: "C1", iso3: "USA", q: "how many people convert in 2025", expect: "missing" },
];

const BGS = ["christian", "unaffiliated", "hindu", "buddhist_ea"] as const;
const words = (t: string) => new Set(t.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((w) => w.length > 2));
const jac = (a: string, b: string) => { const A = words(a), B = words(b); let i = 0; A.forEach((w) => B.has(w) && i++); return i / (A.size + B.size - i || 1); };

export default function Evaluation() {
  const locale = getLocale(); const ar = locale === "ar";
  const rows = CASES.map((c) => {
    const r: any = runJourney({ iso3: c.iso3, background: c.bg, question: c.q });
    const got = r.error ? "error" : r.abstain_flag ? "abstain" : r.missing_figure ? "missing" : r.answer ? (r.answer.no_match ? "no_match" : "answer") : "journey";
    const claims = r.error ? 0 : new Set([...(r.claim_ids || []), ...((r.headlines || []).flatMap((h: any) => h.claim_ids || []))]).size;
    return { c, got, ok: got === c.expect, claims, reason: r.abstain_reason, ref: r.referral?.centers?.length || 0 };
  });
  // Value over the single-template alternative: same country, four explicit backgrounds -> how different are the texts?
  const base: any = runJourney({ iso3: "FRA", background: "christian" });
  const diffs = BGS.slice(1).map((b) => { const r: any = runJourney({ iso3: "FRA", background: b }); return { b, sim: jac(base.detail.en, r.detail.en), hsim: jac(base.headlines.map((h: any) => h.en).join(" "), r.headlines.map((h: any) => h.en).join(" ")), same: r.template_id === base.template_id }; });
  // Repeatability: every case run three times must give byte-identical output.
  const stable = CASES.every((c) => { const j = () => JSON.stringify(runJourney({ iso3: c.iso3, background: c.bg, question: c.q })); const a = j(); return a === j() && a === j(); });
  const passed = rows.filter((r) => r.ok).length;
  const lab: Record<string, [string, string]> = { journey: ["رحلة مسنَدة", "Sourced journey"], abstain: ["امتناع وإحالة", "Abstain + referral"], missing: ["لا رقم مؤكد", "No verified figure"], answer: ["جواب من الحزمة", "Answer from the pack"], no_match: ["لا مطابقة", "No match"], error: ["خطأ", "Error"] };
  const L = (k: string) => lab[k][ar ? 0 : 1];
  return (
    <div className="px-6"><div className="mx-auto max-w-4xl pt-8">
      <p className="folio">Bathel 2026 · 03</p>
      <h1 className="mt-1 text-4xl font-semibold">{ar ? "التحقق والاختبار" : "Verification and testing"}</h1>
      <p className="mt-4 text-lg text-limestone/90">{ar
        ? "هذه الصفحة تشغّل محرك الرحلة الفعلي عند كل طلب على حالات ثابتة، وتعرض ما حدث فعلاً. ليست لقطة مصوّرة ولا وعداً: إن تغيّر السلوك تغيّرت النتيجة هنا."
        : "This page runs the real journey engine on every request against fixed cases and shows what actually happened. It is not a screenshot or a promise: if behaviour changes, the result here changes."}</p>
      <div className="verify mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-2">
        <p className="text-2xl num" dir="ltr">{passed} / {rows.length}</p>
        <p>{ar ? "حالات جاءت النتيجة فيها كما هو متوقع (حية الآن)." : "cases behaved as expected (live now)."}</p>
      </div>
      <div className="refs-wrap mt-8"><table className="dark-table">
        <thead><tr><th>#</th><th>{ar ? "الدولة / السؤال" : "Country / input"}</th><th>{ar ? "المتوقع" : "Expected"}</th><th>{ar ? "الفعلي" : "Actual"}</th><th>{ar ? "مصادر" : "Sources"}</th></tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.c.id}>
            <td className="num" data-label="#">{r.c.id}</td>
            <td data-label={ar ? "الدولة / السؤال" : "Country / input"}><span className="num">{r.c.iso3}</span>{r.c.bg ? ` · ${r.c.bg}` : ""}{r.c.q ? <div className="text-limestone/80" dir="auto">{r.c.q}</div> : <div className="text-limestone/60">{ar ? "بلا سؤال" : "no question"}</div>}</td>
            <td data-label={ar ? "المتوقع" : "Expected"}>{L(r.c.expect)}</td>
            <td data-label={ar ? "الفعلي" : "Actual"}>{L(r.got)}{r.reason ? <span className="text-limestone/60"> · {r.reason}</span> : null}{r.ref ? <span className="text-limestone/60"> · {ar ? "إحالة" : "referral"} ×{r.ref}</span> : null}</td>
            <td className="num" data-label={ar ? "مصادر" : "Sources"}>{r.claims > 0 ? <Link href="/references" className="underline">{r.claims}</Link> : "0"}</td>
          </tr>))}</tbody></table></div>
      <p className="mt-4" aria-live="polite">{ar ? "الاستقرار: كل حالة شُغّلت ثلاث مرات." : "Repeatability: every case run three times."} <strong>{stable ? (ar ? "النتائج متطابقة حرفياً." : "Outputs byte-identical.") : (ar ? "اختلفت النتائج." : "Outputs differ.")}</strong></p>
      <h2 className="mt-12 text-2xl font-semibold">{ar ? "القيمة مقارنةً بقالب واحد للجميع" : "Value over one template for everyone"}</h2>
      <p className="mt-3 text-limestone/90">{ar ? "البديل الذي نقارن به: مقدمة واحدة ثابتة لكل زائر (تشابه 1.00). نأخذ فرنسا بخلفية مسيحية مرجعاً ونقيس تشابه نص التفصيل ورؤوس الأقلام مع بقية الخلفيات (مقياس جاكار على الكلمات؛ أقل يعني نصاً أشد اختلافاً). هذا يقيس تمايز الخطاب لا الفهم؛ الفهم يحتاج اختباراً مع الفئة المستهدفة ولم يُجرَ بعد." : "The alternative we compare with: one fixed introduction for every visitor (similarity 1.00). Taking France with a Christian background as reference, we measure word-overlap (Jaccard; lower means more different text) of the detail and headlines against the other explicit backgrounds. This measures differentiation of the framing, not comprehension; comprehension needs a test with the target group, which has not been run yet."}</p>
      <div className="refs-wrap mt-4"><table className="dark-table"><thead><tr><th>{ar ? "الخلفية" : "Background"}</th><th>{ar ? "تشابه التفصيل" : "Detail similarity"}</th><th>{ar ? "تشابه رؤوس الأقلام" : "Headline similarity"}</th><th>{ar ? "نفس القالب؟" : "Same template?"}</th></tr></thead>
        <tbody>{diffs.map((d) => <tr key={d.b}><td data-label={ar ? "الخلفية" : "Background"}>{d.b}</td><td className="num" data-label={ar ? "تشابه التفصيل" : "Detail similarity"}>{d.sim.toFixed(2)}</td><td className="num" data-label={ar ? "تشابه رؤوس الأقلام" : "Headline similarity"}>{d.hsim.toFixed(2)}</td><td data-label={ar ? "نفس القالب؟" : "Same template?"}>{d.same ? (ar ? "نعم" : "yes") : (ar ? "لا" : "no")}</td></tr>)}</tbody></table></div>
      <h2 className="mt-12 text-2xl font-semibold">{ar ? "اختبار المستفيد: ما أُنجز وما لم يُنجز" : "User testing: what is done and what is not"}</h2>
      <ul className="mt-4 space-y-3 text-lg text-limestone/90">
        <li className="rule pt-3">{ar ? "أُنجز: قياس مسار المهمة في متصفح حقيقي، من الصفحة الرئيسية إلى رحلة مسنَدة بنقرة واحدة، ومن أي نسبة إلى صف مصدرها بنقرة واحدة." : "Done: task-path measurement in a real browser: home to a sourced journey in one click, and from any percentage to its source row in one click."}</li>
        <li className="rule pt-3">{ar ? "لم يُنجز: اختبار مع قراء من الخلفيات المستهدفة. الخطة: ثمانية قراء على الأقل، ثلاث مهام (فهم مفهوم، إيجاد مصدر رقم، طرح سؤال حكم فيمتنع الأطلس)، وتُسجَّل الأخطاء وتُعدَّل الصياغة قبل 4–6 أكتوبر." : "Not done: testing with readers from the target backgrounds. Plan: at least eight readers, three tasks (grasp a concept, find the source of a number, ask a ruling question and see the atlas abstain), errors logged and wording revised before 4–6 October."}</li>
      </ul>
      <h2 className="mt-12 text-2xl font-semibold">{ar ? "ما الذي يفعله الذكاء الاصطناعي هنا، وما لا يفعله" : "What the AI does here, and what it does not"}</h2>
      <ul className="mt-4 space-y-3 text-lg text-limestone/90">
        <li className="rule pt-3">{ar ? "يفعل: توجيه القالب حسب دولة الزائر أو خلفيته المعلنة، واسترجاع مقاطع من حزمة مغلقة بمطابقة لفظية، وإسناد كل جملة إلى معرّف مصدر، والامتناع والإحالة في الفتوى والحدود والردة والأحكام الخاصة بالجنسين والسياسة المعاصرة." : "It does: route the template by country or stated background, retrieve passages from a closed pack by lexical matching, attach a source id to every claim, and abstain with referral on fatwa, hudud, apostasy, gender rulings and contemporary politics."}</li>
        <li className="rule pt-3">{ar ? "لا يفعل: لا يولّد نصاً حراً، ولا يقدّر رقماً غير موجود، ولا يستنتج دين الزائر، ولا يفتي، ولا يحصي المعتنقين سنوياً." : "It does not: generate free text, estimate a missing figure, infer the visitor's religion, issue rulings, or count converts per year."}</li>
        <li className="rule pt-3">{ar ? "حدود معلنة: اثنتا عشرة دولة، واسترجاع لفظي لا دلالي، ومراكز قليلة متحقَّق منها، ونصوص عربية وإنجليزية قالبية تحتاج مراجعة علمية قبل مرحلة التحكيم." : "Stated limits: twelve countries, lexical rather than semantic retrieval, few verified centres, and template Arabic/English copy that needs scholarly review before the judged phase."}</li>
      </ul>
      <h2 className="mt-12 text-2xl font-semibold">{ar ? "الخصوصية" : "Privacy"}</h2>
      <ul className="mt-4 space-y-3 text-lg text-limestone/90">
        <li className="rule pt-3">{ar ? "لا حسابات ولا تتبع ولا تحليلات. الكوكي الوحيد يحفظ اختيار اللغة (lang). لا يُحفظ سؤالك ولا خلفيتك، ولا يُستنتج دينك من لغتك أو موقعك أو سلوكك." : "No accounts, no tracking, no analytics. The only cookie stores your language choice (lang). Your question and background are not stored, and your religion is never inferred from language, location or behaviour."}</li>
      </ul>
      <h2 className="mt-12 text-2xl font-semibold">{ar ? "التشغيل بعد التحدي" : "Operating it after the challenge"}</h2>
      <ul className="mt-4 space-y-3 text-lg text-limestone/90">
        <li className="rule pt-3">{ar ? "التكلفة: لا خادم ذكاء اصطناعي ولا مفتاح API؛ موقع Next.js على استضافة مجانية أو رخيصة، والبيانات ملفات JSON ضمن المستودع." : "Cost: no model server and no API key; a Next.js site on free or low-cost hosting, with data as JSON files in the repository."}</li>
        <li className="rule pt-3">{ar ? "المراجعة: يراجع مختص شرعي كل قالب ومقطع قبل نشره، وتُجدَّد أرقام Pew مرة عند صدور جدول جديد، ويُعاد التحقق من روابط المراكز كل ربع سنة." : "Review: a qualified scholar reviews each template and passage before it ships, Pew figures are refreshed when a new table is published, and centre links are re-verified quarterly."}</li>
        <li className="rule pt-3">{ar ? "الاختبار: هذه الصفحة وملف scripts/test-journey.mjs في المستودع يعملان على الموقع الحي وعلى المحلي." : "Testing: this page and scripts/test-journey.mjs in the repository run against the live site and locally."}</li>
      </ul>
      <p className="mt-10 flex flex-wrap gap-x-6 gap-y-2"><Link href="/references" className="lnk-strong">{ar ? "المراجع" : "References"}</Link><Link href="/method" className="lnk-strong">{ar ? "المنهج" : "Method"}</Link><a className="lnk-strong" href="https://github.com/tmrsa1-ui/islamic-religion-atlas" target="_blank" rel="noopener noreferrer">GitHub</a></p>
    </div></div>
  );
}
