import EarthPlate from "@/components/EarthPlate";
import { countries, groupLabels } from "@/lib/data";
import { getLocale, u } from "@/lib/i18n";
import Link from "next/link";

export default function Home() {
  const locale = getLocale();
  const ar = locale === "ar";
  const items = countries.map((c) => {
    const top = [...c.composition].sort((a, b) => b.pct - a.pct)[0];
    return { iso3: c.iso3, ar: c.name.ar, en: c.name.en, top: `${groupLabels[top.g][locale]} ${top.pct}%`, g: top.g, gLabel: groupLabels[top.g][locale], pct: top.pct };
  });
  return (
    <div className="px-6">
      <section className="mx-auto max-w-6xl pt-10 md:pt-16 hero">
        <p className="kicker">Bathel 2026 · 03</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-tight">{u("title", locale)}</h1>
        <p className="mt-6 max-w-2xl text-lg md:text-xl text-limestone/85">{u("tagline", locale)}</p>
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[.98rem]">
          <Link href="/references" className="lnk-strong">{u("nav_refs", locale)}</Link>
          <Link href="/method" className="lnk-strong">{u("nav_method", locale)}</Link>
          <Link href="/centers" className="lnk-strong">{u("nav_centers", locale)}</Link>
        </p>
      </section>
      <section className="mx-auto max-w-6xl mt-10" id="countries" aria-labelledby="choose">
        <p className="sec-n">01</p>
        <h2 id="choose" className="text-2xl md:text-3xl font-semibold mb-8">{u("choose", locale)}</h2>
        <EarthPlate locale={locale} items={items} />
      </section>
      <section className="mx-auto max-w-6xl mt-20" aria-labelledby="how">
        <p className="sec-n">02</p>
        <h2 id="how" className="text-2xl md:text-3xl font-semibold mb-8">{ar ? "كيف تعمل الرحلة" : "How the journey works"}</h2>
        <ol className="how">
          <li><span className="n">01</span><h3 className="text-lg font-semibold mt-1">{ar ? "تختار دولة" : "Choose a country"}</h3>
            <p className="mt-2 text-limestone/85">{ar ? "من الكرة أو القائمة. ترى التركيبة الدينية لعام 2020 من Pew، وكل نسبة رابط إلى صفها في المراجع." : "From the globe or the list. You see the 2020 religious composition from Pew, and every percentage links to its row in the references."}</p></li>
          <li><span className="n">02</span><h3 className="text-lg font-semibold mt-1">{ar ? "تختار خلفية إن شئت" : "Optionally state a background"}</h3>
            <p className="mt-2 text-limestone/85">{ar ? "الخطاب يتبع أغلبية الدولة أو اختيارك الصريح فقط. لا نستنتج دينك من لغتك أو موقعك أو سلوكك." : "The framing follows the country's majority or your explicit choice only. We never infer your religion from language, location or behaviour."}</p></li>
          <li><span className="n">03</span><h3 className="text-lg font-semibold mt-1">{ar ? "رحلة قصيرة مسنَدة" : "A short, sourced journey"}</h3>
            <p className="mt-2 text-limestone/85">{ar ? "رؤوس أقلام، ثم مفهوم إسلامي واحد، ثم مصدر أو مركز متحقَّق منه. اسأل سؤالاً حراً، وحين يكون الجواب حكماً شرعياً يمتنع الأطلس ويحيل إلى أهل العلم." : "Headlines, then one Islamic concept, then a source or a verified centre. Ask a free question; where the answer would be a religious ruling the atlas abstains and refers you to scholars."}</p></li>
        </ol>
        <div className="verify mt-10">
          <h3 className="text-lg font-semibold">{ar ? "تحقق بنفسك" : "Verify it yourself"}</h3>
          <p className="mt-2 text-limestone/85">{ar ? "المصادر حزمة مغلقة لا يخرج الأطلس عنها. الرقم غير المتوافر يظهر «لا رقم مؤكد» ولا يُقدَّر. الذكاء هنا استرجاع مسنَد وتوجيه قالب وامتناع، وليس توليداً حراً." : "The sources are a closed pack the atlas never leaves. A figure we do not hold reads «لا رقم مؤكد» and is never estimated. The AI here is sourced retrieval, template routing and abstention, not free generation."}</p>
          <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[.98rem]">
            <Link href="/references" className="lnk-strong">{u("nav_refs", locale)}</Link>
            <Link href="/method" className="lnk-strong">{u("nav_method", locale)}</Link>
            <Link href="/about" className="lnk-strong">{u("nav_about", locale)}</Link>
            <Link href="/centers" className="lnk-strong">{u("nav_centers", locale)}</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
