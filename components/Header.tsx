import Link from "next/link";
import type { Locale } from "@/lib/types";
import { u } from "@/lib/i18n";
import LangToggle from "./LangToggle";

export default function Header({ locale }: { locale: Locale }) {
  const nav = [["/", "nav_home"], ["/references", "nav_refs"], ["/centers", "nav_centers"], ["/method", "nav_method"], ["/about", "nav_about"]];
  return (
    <header className="px-6 py-5">
      <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold tracking-wide" aria-label={u("title", locale)}>{u("title", locale)}</Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[0.98rem]" aria-label="main">
          {nav.map(([h, k]) => <Link key={h} href={h} className="text-limestone/80 hover:text-limestone">{u(k, locale)}</Link>)}
          <LangToggle locale={locale} label={u("lang_toggle", locale)} />
        </nav>
      </div>
    </header>
  );
}
