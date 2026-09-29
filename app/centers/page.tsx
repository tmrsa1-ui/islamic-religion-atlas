import { allCenters, centersData, countries } from "@/lib/data";
import { getLocale, u } from "@/lib/i18n";

export default function Centers() {
  const locale = getLocale();
  const list = allCenters.filter((c) => c.verified && c.url);
  return (
    <div className="px-6"><div className="mx-auto max-w-3xl pt-8">
      <h1 className="text-4xl font-bold">{u("centers_title", locale)}</h1>
      <p className="mt-4 text-limestone/85">{centersData.note[locale]}</p>
      <ul className="mt-8 space-y-6">
        {list.map((c) => (
          <li key={c.id} className="rule pt-4">
            <p className="text-xl font-bold">{c.name[locale]}</p>
            <p>{c.about[locale]}</p>
            <p className="text-sm text-limestone/75 mt-1">{c.countries.map((i) => countries.find((x) => x.iso3 === i)?.name[locale]).join(" · ")}</p>
            <p className="text-sm mt-1"><a className="underline latin" target="_blank" rel="noopener noreferrer" href={c.url}>{c.url}</a> · <span className="latin">{c.verified_on}</span></p>
          </li>
        ))}
      </ul>
    </div></div>
  );
}
