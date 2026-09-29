import { getLocale } from "@/lib/i18n";

export default function About() {
  const locale = getLocale();
  const ar = locale === "ar";
  const P = (a: string, e: string) => <p className="rule pt-3 mt-3 text-lg text-limestone/90">{ar ? a : e}</p>;
  return (
    <div className="px-6"><div className="mx-auto max-w-3xl pt-8">
      <h1 className="text-4xl font-bold">{ar ? "عن المشروع" : "About"}</h1>
      {P("«أطلس الدين الإسلامي» مشروع لمسار التجارب التفاعلية في تحدي باذل 2026 (المسار 03). ينطلق من مشكلة القالب الواحد: مقدمة واحدة عن الإسلام لا تناسب قارئاً مسيحياً وهندوسياً وعلمانياً وبوذياً معاً.", "Islamic Religion Atlas is a project for the interactive-experiences track of the Bathel 2026 challenge (track 03). It starts from the one-template problem: a single introduction to Islam fails a Christian, a Hindu, a secular and a Buddhist reader alike.")}
      {P("الذكاء الاصطناعي هنا استرجاعٌ مسنَد من حزمة مصادر مغلقة، وتوجيهٌ للقالب، وامتناعٌ وإحالة حين لا يجوز الإفتاء. الخريطة ليست هي الذكاء.", "The AI here is sourced retrieval from a closed pack, template routing, and abstention with referral where a ruling would be improper. The map is not the AI.")}
      {P("هذه نسخة بداية أُنجزت في 29 سبتمبر 2026، وتُقيَّم النسخة المنجزة في 4–6 أكتوبر 2026. لا نستنتج دين الزائر أبداً. لا أعداد سنوية للمعتنقين.", "This is a starter build made on 29 September 2026; the judged version is the work of 4–6 October 2026. We never infer a visitor's religion. No annual convert counts.")}
      {P("المصادر: Pew Research Center، وأعمال أكاديمية محكّمة عن الاعتناق (كامبريدج، فان نيوكيرك، كوسه، زيبيري)، والنص القرآني.", "Sources: Pew Research Center, peer-reviewed academic work on conversion (Cambridge, van Nieuwkerk, Köse, Zebiri), and the Qur'anic text.")}
    </div></div>
  );
}
