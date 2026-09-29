import { badges, centersData, allCenters, getCountry, getRef, missingLabel, templates } from "./data";
import type { Background, Bi, Center, Headline, JourneyResult } from "./types";
import { BACKGROUNDS } from "./types";

const SECTIONS = ["curiosity", "misconceptions", "attractions", "objections"] as const;

function norm(s: string) {
  return s
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");
}

// Topics on which the system never gives a ruling.
const ABSTAIN_RULES: { reason: string; label: Bi; re: RegExp }[] = [
  { reason: "hudud", label: { ar: "الحدود والعقوبات الشرعية", en: "hudud and legal punishments" },
    re: /\b(hadd|hudud|hudood|stoning|amputat\w*|cut(ting)? (off )?(the |a )?hand|punishment for (theft|adultery|zina|stealing)|penalty for (theft|adultery|zina)|flogging|lashes|qisas)\b|حد السرق|حدود|حد الزنا|حد الحرابه|حد القذف|حد الخمر|قطع اليد|الرجم|جلد|القصاص|عقوبه (السرق|الزنا|الردة|المرتد)|ما حد|حد (ال)?\w*(سرقه|زنا)/ },
  { reason: "apostasy", label: { ar: "الردة", en: "apostasy" },
    re: /\b(apostasy|apostate|apostates|leave islam|leaving islam|renounce islam|blasphem\w*)\b|ردة|الردة|مرتد|الارتداد|ترك الاسلام|الخروج من الاسلام|ازدراء|سب الدين|تجديف/ },
  { reason: "gender_rulings", label: { ar: "الأحكام المتعلقة بالجنسين", en: "gender-related rulings" },
    re: /\b(women'?s? (rights|role|testimony|inheritance)|hijab (ruling|obligatory|mandatory)|is hijab (obligatory|mandatory|required)|polygamy|polygyny|wife beating|beat(ing)? (my |his |one'?s )?wife|inheritance (share|ruling)|may a woman|can a woman|is it (halal|haram|permissible)|divorce ruling|LGBT|homosexual\w*|gay marriage|same[- ]sex)\b|حكم (الحجاب|تعدد|ضرب|ميراث)|الحجاب واجب|تعدد الزوجات|ضرب الزوجه|ميراث المراه|شهاده المراه|قوامه|ولايه المراه|المثليه|الشذوذ|هل يجوز|حلال ام حرام/ },
  { reason: "contemporary_politics", label: { ar: "السياسة المعاصرة", en: "contemporary politics" },
    re: /\b(election|vote for|which party|government|president|prime minister|caliphate|sharia law (should|in)|jihad(ist)?s?|terror\w*|isis|hamas|hezbollah|taliban|war in|sanctions|israel|palestin\w*|gaza|ukraine|immigration policy|ban on|burqa ban|veil ban|politic\w*)\b|انتخاب|حزب|حكومه|رئيس|رئاسه|الخلافه|داعش|حماس|حزب الله|طالبان|ارهاب|جهاد|سياس|حرب|غزه|فلسطين|اسرائيل|اوكرانيا|حظر (الحجاب|النقاب)/ },
  { reason: "fatwa_request", label: { ar: "طلب فتوى", en: "a request for a fatwa" },
    re: /\b(fatwa|is it (a )?sin|halal or haram|ruling on|what is the ruling|permissible in islam)\b|فتوي|فتوى|ما حكم|هل هو حرام|حرام ام حلال|كفارة/ },
];

// Questions about figures we hold no verified data for.
const MISSING_RE = /\b(2021|2022|2023|2024|2025|2026|per year|annual(ly)?|each year|every year|how many (people )?(convert|converts|embrace|revert)|number of converts|converts? (count|number)|convert(s)? per|projected|forecast|2030|2050)\b|سنوي|كل سنه|كل عام|كم (عدد )?(من )?(المعتنق|المسلمين الجدد|يعتنق)|عدد (المعتنقين|المهتدين|المسلمين الجدد)|2021|2022|2023|2024|2025|2026|2030|2050|توقع/;

export function classifyQuestion(q: string) {
  const n = norm(q);
  for (const r of ABSTAIN_RULES) if (r.re.test(q.toLowerCase()) || r.re.test(n)) return { kind: "abstain" as const, rule: r };
  if (MISSING_RE.test(q.toLowerCase()) || MISSING_RE.test(n)) return { kind: "missing" as const };
  return { kind: "ok" as const };
}

function centersFor(iso3: string, scope?: string): Center[] {
  return allCenters
    .filter((c) => c.verified && !!c.url && c.countries.includes(iso3) && (!scope || c.scope === scope))
    .map((c) => ({ id: c.id, name: c.name, url: c.url, verified: c.verified, verified_on: c.verified_on, about: c.about, scope: c.scope }));
}

function referralCenters(): Center[] {
  return (centersData.referral_ids as string[])
    .map((id) => allCenters.find((c) => c.id === id))
    .filter((c): c is any => !!c && c.verified && !!c.url)
    .map((c: any) => ({ id: c.id, name: c.name, url: c.url, verified: c.verified, verified_on: c.verified_on, about: c.about, scope: c.scope }));
}

// Simple lexical retrieval over the closed template pack.
function retrieve(q: string, templateId: string) {
  const tokens = norm(q).split(/[^\p{L}\p{N}]+/u).filter((t) => t.length > 2);
  const t = templates[templateId];
  if (!t || !tokens.length) return [];
  const pool: (Bi & { claim_ids?: string[] })[] = [];
  for (const s of SECTIONS) for (const h of t[s]) pool.push(h);
  pool.push({ ar: t.one_concept.ar, en: t.one_concept.en, claim_ids: t.one_concept.claim_ids });
  const scored = pool
    .map((p) => {
      const hay = norm(p.ar + " " + p.en);
      return { p, s: tokens.reduce((a, tk) => a + (hay.includes(tk) ? 1 : 0), 0) };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 2);
  return scored.map((x) => x.p);
}

const ABSTAIN_TEXT: Bi = {
  ar: "يمتنع الأطلس عن الجواب في هذا الباب. هو مصدر معرفي لا جهة إفتاء، ولا يقدّم حكماً شرعياً ولا موقفاً سياسياً. نحيلك إلى أهل العلم المختصين.",
  en: "The atlas abstains here. It is an educational source, not a fatwa body, and gives no religious ruling and no political position. We refer you to qualified scholars.",
};

export function runJourney(input: { iso3?: string; background?: string; question?: string }): JourneyResult | { error: string; status: number } {
  const iso3 = String(input.iso3 || "").toUpperCase();
  const country = getCountry(iso3);
  if (!country) return { error: "unknown_iso3", status: 400 };
  let bg = input.background as Background | undefined;
  if (bg !== undefined && !BACKGROUNDS.includes(bg)) return { error: "invalid_background", status: 400 };
  // explicit background wins; "unspecified" and absence fall back to the country's template
  const explicit = !!bg && bg !== "unspecified";
  const templateId = explicit ? (bg as string) : country.content_template_id;
  const tpl = templates[templateId];
  const variant = explicit ? "explicit" : country.badge_variant;
  const b = badges[variant] || badges.default;
  const badge = { ar: b.main.ar, en: b.main.en, note: b.note ?? null, variant };

  const base: JourneyResult = {
    iso3, country: country.name, template_id: templateId, explicit_background: explicit, badge,
    headlines: [], detail: null, claim_ids: [], centers: [], abstain_flag: false, next_step: null, method: "/method",
  };

  const q = (input.question || "").trim().slice(0, 500);
  if (q) {
    const c = classifyQuestion(q);
    if (c.kind === "abstain") {
      const refs = referralCenters();
      return { ...base, abstain_flag: true, abstain_reason: c.rule.reason,
        referral: { ar: `${ABSTAIN_TEXT.ar} الموضوع: ${c.rule.label.ar}.`, en: `${ABSTAIN_TEXT.en} Topic: ${c.rule.label.en}.`, centers: refs },
        centers: refs, claim_ids: ["dar-alifta-official", "azhar-official"], answer: null };
    }
    if (c.kind === "missing") {
      return { ...base, missing_figure: { ar: `${missingLabel.ar}. لا نملك رقماً موثّقاً لهذا السؤال؛ راجع صفحة المنهج.`, en: `${missingLabel.en}. We hold no verified figure for this question; see the method page.`, link: "/method" }, answer: null };
    }
    const snippets = retrieve(q, templateId);
    const ids = Array.from(new Set(snippets.flatMap((s) => s.claim_ids || [])));
    return { ...base, answer: { snippets, no_match: snippets.length === 0 }, claim_ids: ids, centers: centersFor(iso3) };
  }

  const headlines: Headline[] = [];
  for (const s of SECTIONS) for (const h of tpl[s]) headlines.push({ ar: h.ar, en: h.en, section: s, claim_ids: h.claim_ids });
  const detail = tpl.one_concept;
  const ids = new Set<string>(detail.claim_ids);
  headlines.forEach((h) => h.claim_ids?.forEach((i) => ids.add(i)));
  ids.add("pew-country-table-2020");
  const claim_ids = Array.from(ids).filter((i) => !!getRef(i));
  return {
    ...base,
    headlines: headlines.slice(0, 8),
    detail: { ar: detail.ar, en: detail.en, claim_ids: detail.claim_ids, words: { ar: detail.ar.split(/\s+/).length, en: detail.en.split(/\s+/).length } },
    claim_ids,
    centers: centersFor(iso3),
    next_step: tpl.next_step,
  };
}
