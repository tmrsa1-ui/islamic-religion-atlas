import fs from "node:fs";
import path from "node:path";
import { getLocale } from "@/lib/i18n";

function render(md: string) {
  return md.split("\n").filter((l) => l.trim()).map((l, i) =>
    l.startsWith("# ") ? <h1 key={i} className="text-4xl font-bold mb-4">{l.slice(2)}</h1>
    : l.startsWith("## ") ? <h2 key={i} className="text-xl font-bold mt-8 mb-2">{l.slice(3)}</h2>
    : <p key={i} className="rule pt-2 mt-2 text-lg text-limestone/90">{l.replace(/^- /, "")}</p>);
}
export default function Method() {
  const locale = getLocale();
  const raw = fs.readFileSync(path.join(process.cwd(), "data", "method.md"), "utf8");
  const [ar, en] = raw.split("<!-- en -->");
  const md = locale === "ar" ? ar.replace("<!-- ar -->", "") : en;
  return <div className="px-6"><div className="mx-auto max-w-3xl pt-8">{render(md)}</div></div>;
}
