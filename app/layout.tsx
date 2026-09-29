import type { Metadata } from "next";
import { Noto_Naskh_Arabic, EB_Garamond } from "next/font/google";
import "./globals.css";
import { getLocale, u } from "@/lib/i18n";
import Header from "@/components/Header";

const ar = Noto_Naskh_Arabic({ subsets: ["arabic"], variable: "--font-ar", display: "swap" });
const latin = EB_Garamond({ subsets: ["latin"], variable: "--font-latin", display: "swap" });

export const metadata: Metadata = {
  title: "أطلس الدين الإسلامي | Islamic Religion Atlas",
  description: "مدخل معرفي إلى الإسلام مبني على بيانات Pew 2020 ومصادر مغلقة — Bathel 2026، المسار 03. A source-bound educational entry to Islam. Starter build.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={`${ar.variable} ${latin.variable}`}>
      <body>
        <Header locale={locale} />
        <main>{children}</main>
        <footer className="rule mt-24 px-6 py-10 text-sm text-limestone/70">
          <div className="mx-auto max-w-6xl flex flex-wrap gap-x-8 gap-y-2 justify-between">
            <span>{u("starter", locale)}</span>
            <a className="underline" href="/references">{u("footer_refs", locale)}</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
