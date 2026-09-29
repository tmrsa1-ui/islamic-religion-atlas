"use client";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/types";

export default function LangToggle({ locale, label }: { locale: Locale; label: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="chip"
      lang={locale === "ar" ? "en" : "ar"}
      onClick={() => { document.cookie = `lang=${locale === "ar" ? "en" : "ar"}; path=/; max-age=31536000; samesite=lax`; router.refresh(); }}
    >{label}</button>
  );
}
