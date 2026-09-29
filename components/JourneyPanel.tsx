"use client";
import Link from "next/link";
import { useState } from "react";
import type { JourneyResult, Locale, Background } from "@/lib/types";
import { BACKGROUNDS, BG_LABEL } from "@/lib/types";

const L: Record<string, { ar: string; en: string }> = {
  choose_bg: { ar: "أو اختر خلفية بنفسك (اختياري)", en: "Or choose a background yourself (optional)" },
  bg_note: { ar: "لا يستنتج الأطلس دينك من لغتك أو سلوكك أو موقعك. ما تراه يتبع دولتك أو اختيارك الصريح فقط.", en: "The atlas never infers your religion from your language, behaviour or location. What you see follows the country or your explicit choice only." },
  headlines: { ar: "رؤوس أقلام", en: "Headlines" },
  detail: { ar: "التفصيل: مفهوم واحد", en: "Detail: one concept" },
  expand: { ar: "اقرأ التفصيل", en: "Read the detail" }, collapse: { ar: "أخفِ التفصيل", en: "Hide the detail" },
  sources: { ar: "المصادر", en: "Sources" },
  centers: { ar: "مراكز متحقَّق منها", en: "Verified centres" },
  no_centers: { ar: "لا مركز متحقَّق منه لهذه الدولة بعد. لا نعرض جهة بلا رابط رسمي.", en: "No verified centre for this country yet. We list no institution without an official URL." },
  verified_on: { ar: "جرى التحقق بتاريخ", en: "verified on" },
  visit: { ar: "الموقع الرسمي", en: "Official site" },
  ask_title: { ar: "اسأل سؤالاً", en: "Ask a question" },
  ask_hint: { ar: "استرجاع من حزمة مغلقة. لا يفتي الأطلس، ويمتنع عن الأحكام والسياسة.", en: "Retrieval from a closed pack. The atlas issues no rulings and abstains on rulings and politics." },
  ask_placeholder: { ar: "اكتب سؤالك هنا", en: "Type your question here" },
  ask_btn: { ar: "أرسل", en: "Ask" },
  abstain_title: { ar: "يمتنع الأطلس عن الجواب", en: "The atlas abstains" },
  answer_title: { ar: "من الحزمة المغلقة", en: "From the closed pack" },
  no_match: { ar: "لا مقطع في الحزمة يطابق سؤالك. جرّب كلمات أخرى أو راجع صفحة المنهج.", en: "No passage in the pack matches your question. Try other words or see the method page." },
  next_step: { ar: "الخطوة التالية", en: "Next step" },
  method: { ar: "المنهج", en: "Method" },
  err: { ar: "تعذّر الاتصال. أعد المحاولة.", en: "Could not connect. Please retry." },
  footer_refs: { ar: "المراجع", en: "References" },
  busy: { ar: "جارٍ التحميل", en: "Loading" },
};
const SECTION_LABEL: Record<string, { ar: string; en: string }> = {
  curiosity: { ar: "فضول", en: "Curiosity" }, misconceptions: { ar: "تصحيح", en: "Clarification" },
  attractions: { ar: "ما تذكره الدراسات", en: "What studies note" }, objections: { ar: "اعتراض شائع", en: "Common objection" },
};
const refHref = (id: string) => `/references#${id}`;

export default function JourneyPanel({ initial, locale }: { initial: JourneyResult; locale: Locale }) {
  const [res, setRes] = useState<JourneyResult>(initial);
  const [bg, setBg] = useState<Background | null>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  const t = (k: string) => L[k][locale];

  async function call(background: Background | null, question?: string) {
    setBusy(true); setErr(false);
    try {
      const r = await fetch("/api/journey", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ iso3: initial.iso3, background: background ?? undefined, question: question || undefined }) });
      if (!r.ok) throw new Error(String(r.status));
      setRes(await r.json());
    } catch { setErr(true); } finally { setBusy(false); }
  }
  const pickBg = (b: Background) => { const next = bg === b ? null : b; setBg(next); setQ(""); call(next); };
  const ask = (e: React.FormEvent) => { e.preventDefault(); if (q.trim()) call(bg, q.trim()); };
  const isQuestion = res.abstain_flag || !!res.answer || !!res.missing_figure;

  return (
    <div aria-busy={busy}>
      <div className="rule pt-6">
        <p className="kicker">{t("choose_bg")}</p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={t("choose_bg")}>
          {BACKGROUNDS.map((b) => (
            <button key={b} type="button" className="chip" aria-pressed={bg === b} onClick={() => pickBg(b)}>{BG_LABEL[b][locale]}</button>
          ))}
        </div>
        <p className="mt-3 text-sm text-limestone/70">{t("bg_note")}</p>
      </div>

      <div className="badge mt-8" data-testid="badge">
        <span className="kicker">{res.explicit_background ? (locale === "ar" ? "خطاب وفق اختيارك الصريح" : "Framing from your explicit choice") : (locale === "ar" ? "خطاب ملائم لأغلبية هذه الدولة" : "Framing suited to this country's majority")}</span>
        {res.badge.variant !== "default" && <p className="mt-1 text-lg">{res.badge[locale]}</p>}
        {res.badge.note && <p className="text-sm text-limestone/75">{res.badge.note[locale]}</p>}
      </div>

      {!isQuestion && (
        <>
          <section className="mt-10" aria-labelledby="hl">
            <h2 id="hl" className="text-xl font-semibold">{t("headlines")}</h2>
            <ol className="mt-4 space-y-4">
              {res.headlines.map((h, i) => (
                <li key={i} className="rule pt-3 pb-1 hl-item">
                  <span className="kicker"><span className="num me-2">{String(i + 1).padStart(2, "0")}</span>{SECTION_LABEL[h.section]?.[locale]}</span>
                  <p className="text-lg">{h[locale]}{h.claim_ids?.map((c) => <Link key={c} href={refHref(c)} className="num text-sm text-limestone/70 ms-2 underline">[{c}]</Link>)}</p>
                </li>
              ))}
            </ol>
          </section>

          {res.detail && (
            <section className="mt-10" aria-labelledby="dt">
              <h2 id="dt" className="text-xl font-semibold">{t("detail")}</h2>
              <button type="button" className="chip mt-3" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? t("collapse") : t("expand")}</button>
              <div className={"expand" + (open ? " open" : "")} aria-hidden={!open}><div>
              {open && (
                <div className="mt-4 bg-sea border border-limestone/15 p-5" data-testid="detail">
                  <p className="text-lg">{res.detail[locale]}</p>
                  <p className="mt-4 text-sm"><span className="kicker">{t("sources")}</span>{" "}
                    {res.detail.claim_ids.map((c) => <Link key={c} href={refHref(c)} className="latin underline me-3">{c}</Link>)}</p>
                </div>
              )}
              </div></div>
              {res.next_step && <p className="mt-4 text-limestone/85"><span className="kicker">{t("next_step")}</span> — {res.next_step[locale]}</p>}
            </section>
          )}
        </>
      )}

      {res.abstain_flag && res.referral && (
        <section className="mt-10 missing-block" data-testid="abstain" role="status">
          <h2 className="text-xl font-semibold">{t("abstain_title")}</h2>
          <p className="mt-2 text-lg">{res.referral[locale]}</p>
        </section>
      )}
      {res.missing_figure && (
        <section className="mt-10 missing-block" data-testid="missing" role="status">
          <p className="text-lg"><span className="missing">{locale === "ar" ? "لا رقم مؤكد" : "No verified figure"}</span></p>
          <p className="mt-2">{res.missing_figure[locale]} <Link className="underline" href="/method">{t("method")}</Link></p>
        </section>
      )}
      {res.answer && (
        <section className="mt-10" data-testid="answer">
          <h2 className="text-xl font-semibold">{t("answer_title")}</h2>
          {res.answer.no_match ? <p className="mt-2">{t("no_match")}</p> : res.answer.snippets.map((s, i) => (
            <p key={i} className="mt-3 rule pt-3">{s[locale]}{s.claim_ids?.map((c) => <Link key={c} href={refHref(c)} className="num text-sm text-limestone/70 ms-2 underline">[{c}]</Link>)}</p>
          ))}
        </section>
      )}

      <section className="mt-10" aria-labelledby="ask">
        <h2 id="ask" className="text-xl font-semibold">{t("ask_title")}</h2>
        <p className="text-sm text-limestone/70">{t("ask_hint")}</p>
        <form onSubmit={ask} className="mt-3 flex flex-col sm:flex-row gap-3">
          <label className="sr-only" htmlFor="q">{t("ask_placeholder")}</label>
          <input id="q" className="input" value={q} maxLength={300} onChange={(e) => setQ(e.target.value)} placeholder={t("ask_placeholder")} />
          <button className="btn" type="submit" disabled={busy}>{t("ask_btn")}</button>
        </form>
        {err && <p className="mt-2 missing inline-block">{t("err")}</p>}
      </section>

      <section className="mt-10" aria-labelledby="ct">
        <h2 id="ct" className="text-xl font-semibold">{res.abstain_flag ? (locale === "ar" ? "الإحالة" : "Referral") : t("centers")}</h2>
        {res.centers.length === 0 ? <p className="mt-2 text-limestone/70">{t("no_centers")}</p> : (
          <ul className="mt-3 space-y-4">
            {res.centers.map((c) => (
              <li key={c.id} className="rule pt-3">
                <p className="text-lg font-semibold">{c.name[locale]}</p>
                <p className="text-sm text-limestone/80">{c.about[locale]}</p>
                <p className="text-sm mt-1"><a className="underline latin" href={c.url} rel="noopener noreferrer" target="_blank">{t("visit")}</a> · {t("verified_on")} <span className="latin">{c.verified_on}</span></p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="mt-10 rule pt-4"><Link className="underline" href="/references">{t("footer_refs")}</Link></p>
    </div>
  );
}
