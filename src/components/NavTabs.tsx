"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/quotes", label: "Get Quotes" },
  { href: "/projection", label: "Projection" },
];

export default function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center">
      {tabs.map((t) => {
        const active = pathname === t.href || pathname.startsWith(t.href + "/");
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`px-3 py-2 text-sm font-medium border-b-2 ${
              active
                ? "border-black text-black"
                : "border-transparent text-gray-700 hover:text-black hover:border-gray-300"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
