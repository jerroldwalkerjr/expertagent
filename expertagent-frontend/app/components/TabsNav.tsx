"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/documents", label: "Document Management" },
  { href: "/interactive", label: "Interactive Learning" },
  { href: "/progress", label: "Track My Progress" },
];

export default function TabsNav() {
  const pathname = usePathname();

  return (
    <nav className="rounded-full bg-gradient-to-r from-[#5b3fa5] to-[#7a56c7] p-1 shadow-lg">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-white text-slate-900 shadow"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
