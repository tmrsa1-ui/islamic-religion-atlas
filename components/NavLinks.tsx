"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({ items }: { items: { href: string; label: string }[] }) {
  const path = usePathname();
  return (
    <>
      {items.map((i) => {
        const cur = i.href === "/" ? path === "/" || path.startsWith("/country") : path.startsWith(i.href);
        return <Link key={i.href} href={i.href} className="nav-link" aria-current={cur ? "page" : undefined}>{i.label}</Link>;
      })}
    </>
  );
}
