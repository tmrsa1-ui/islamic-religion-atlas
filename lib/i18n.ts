import { cookies } from "next/headers";
import type { Locale, Bi } from "./types";

export function getLocale(): Locale {
  try { return cookies().get("lang")?.value === "en" ? "en" : "ar"; } catch { return "ar"; }
}
export const t = (b: Bi, l: Locale) => b[l];

export const UI: Record<string, Bi> = {
  title: { ar: "أطلس الدين الإسلامي", en: "Islamic Religion Atlas" },
  tagline: { ar: "مدخل معرفي هادئ إلى الإسلام، يبدأ من التركيبة الدينية للدولة أو من خلفية تختارها أنت صراحةً.", en: "A quiet educational entry to Islam, starting from a country's religious composition or from a background you choose explicitly." },
  starter: { ar: "نسخة بداية — تُقيَّم النسخة المنجزة في 4–6 أكتوبر 2026", en: "Starter build — the judged version is the work of 4–6 October 2026" },
  choose: { ar: "اختر دولة", en: "Choose a country" },
  search: { ar: "ابحث عن دولة", en: "Search for a country" },
  noresults: { ar: "لا دولة بهذا الاسم ضمن الاثنتي عشرة.", en: "No such country among the twelve." },
  plate_alt: { ar: "لوحة الأرض، الدول الاثنتا عشرة مضاءة", en: "Earth plate with the twelve countries lit" },
  nav_home: { ar: "الأطلس", en: "Atlas" }, nav_refs: { ar: "المراجع", en: "References" }, nav_centers: { ar: "المراكز", en: "Centres" }, nav_method: { ar: "المنهج", en: "Method" }, nav_about: { ar: "عن المشروع", en: "About" },
  nav_eval: { ar: "التحقق والاختبار", en: "Verification" },
  lang_toggle: { ar: "English", en: "العربية" },
  pew_title: { ar: "التركيبة الدينية 2020 (Pew)", en: "Religious composition 2020 (Pew)" },
  year: { ar: "السنة", en: "Year" },
  headcount: { ar: "الأعداد التقريبية 2020", en: "Approximate headcounts 2020" },
  million: { ar: "مليون", en: "million" },
  choose_bg: { ar: "أو اختر خلفية بنفسك (اختياري)", en: "Or choose a background yourself (optional)" },
  bg_note: { ar: "لا يستنتج الأطلس دينك من لغتك أو سلوكك أو موقعك. ما تراه يتبع دولتك أو اختيارك الصريح فقط.", en: "The atlas never infers your religion from your language, behaviour or location. What you see follows the country or your explicit choice only." },
  headlines: { ar: "رؤوس أقلام", en: "Headlines" },
  detail: { ar: "التفصيل: مفهوم واحد", en: "Detail: one concept" },
  expand: { ar: "اقرأ التفصيل", en: "Read the detail" }, collapse: { ar: "أخفِ التفصيل", en: "Hide the detail" },
  sources: { ar: "المصادر", en: "Sources" },
  centers: { ar: "مراكز متحقَّق منها", en: "Verified centres" },
  no_centers: { ar: "لا مركز متحقَّق منه لهذه الدولة بعد. لا نعرض جهة بلا رابط رسمي.", en: "No verified centre for this country yet. We list no institution without an official URL." },
  verified_on: { ar: "تُحقِّق بتاريخ", en: "verified on" },
  visit: { ar: "الموقع الرسمي", en: "Official site" },
  ask_title: { ar: "اسأل سؤالاً", en: "Ask a question" },
  ask_hint: { ar: "استرجاع من حزمة مغلقة. لا يفتي الأطلس، ويمتنع عن الأحكام والسياسة.", en: "Retrieval from a closed pack. The atlas issues no rulings and abstains on rulings and politics." },
  ask_placeholder: { ar: "اكتب سؤالك هنا", en: "Type your question here" },
  ask_btn: { ar: "أرسل", en: "Ask" },
  abstain_title: { ar: "يمتنع الأطلس عن الجواب", en: "The atlas abstains" },
  refer: { ar: "الإحالة", en: "Referral" },
  answer_title: { ar: "من الحزمة المغلقة", en: "From the closed pack" },
  no_match: { ar: "لا مقطع في الحزمة يطابق سؤالك. جرّب كلمات أخرى أو راجع صفحة المنهج.", en: "No passage in the pack matches your question. Try other words or see the method page." },
  next_step: { ar: "الخطوة التالية", en: "Next step" },
  footer_refs: { ar: "المراجع", en: "References" },
  missing_link: { ar: "المنهج", en: "Method" },
  loading: { ar: "جارٍ التحميل", en: "Loading" },
  back: { ar: "العودة إلى الأطلس", en: "Back to the atlas" },
  refs_title: { ar: "المراجع", en: "References" },
  refs_intro: { ar: "كل نسبة في الأطلس تقود إلى صف هنا. المصادر مغلقة؛ لا مصدر خارجها.", en: "Every percentage in the atlas leads to a row here. The pack is closed; there is no source outside it." },
  col_statement: { ar: "البيان", en: "Statement" }, col_year: { ar: "السنة", en: "Year" }, col_publisher: { ar: "الناشر", en: "Publisher" }, col_link: { ar: "الرابط", en: "Link" },
  no_year: { ar: "لا سنة", en: "n/a" }, open: { ar: "فتح", en: "Open" },
  centers_title: { ar: "المراكز المتحقَّق منها", en: "Verified centres" },
  method_title: { ar: "المنهج", en: "Method" },
  about_title: { ar: "عن المشروع", en: "About" },
  abstain_badge: { ar: "امتناع", en: "Abstained" },
  center_missing: { ar: "لا رقم مؤكد", en: "No verified figure" },
};
export const u = (k: string, l: Locale) => UI[k][l];
