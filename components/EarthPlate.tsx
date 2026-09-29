import { buildGlobeData } from "@/lib/geo";
import type { Locale } from "@/lib/types";
import { u } from "@/lib/i18n";
import HomeExplorer, { type ListItem } from "./HomeExplorer";

export default function EarthPlate({ locale, items }: { locale: Locale; items: ListItem[] }) {
  const d = buildGlobeData();
  return (
    <HomeExplorer locale={locale} land={d.land} borders={d.borders} geo={d.items} items={items} label={u("plate_alt", locale)}
      placeholder={u("search", locale)} empty={u("noresults", locale)} all={locale === "ar" ? "الكل" : "All"}
      hint={locale === "ar" ? "اسحب الكرة لتدويرها، أو مرّر على دولة في القائمة لتراها على الكرة." : "Drag the globe to turn it, or hover a country in the list to find it on the globe."}
      prevLabel={locale === "ar" ? "تدوير الكرة إلى الجهة السابقة" : "Rotate the globe back"}
      nextLabel={locale === "ar" ? "تدوير الكرة إلى الجهة التالية" : "Rotate the globe forward"} />
  );
}
