import Link from "next/link";
import type { Locale } from "@/lib/types";
import { u } from "@/lib/i18n";
import LangToggle from "./LangToggle";
import NavLinks from "./NavLinks";

export default function Header({ locale }: { locale: Locale }) {
  const nav = [["/", "nav_home"], ["/references", "nav_refs"], ["/centers", "nav_centers"], ["/method", "nav_method"], ["/evaluation", "nav_eval"], ["/about", "nav_about"]].map(([href, k]) => ({ href, label: u(k, locale) }));
  return (
    <header className="site px-6 py-3 border-b border-limestone/10">
      <div className="mx-auto max-w-6xl site-row">
        <Link href="/" className="site-brand text-xl font-semibold no-underline" aria-label={u("title", locale)}>{u("title", locale)}</Link>
        <nav className="site-nav" aria-label="main"><NavLinks items={nav} /></nav>
        <div className="site-lang"><LangToggle locale={locale} label={u("lang_toggle", locale)} /></div>
      </div>
    </header>
  );
}
