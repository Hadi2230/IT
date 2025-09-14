"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/tickets", label: "Tickets" },
  { href: "/assets", label: "Assets" },
  { href: "/licenses", label: "Licenses" },
  { href: "/remote", label: "Remote" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-2 text-sm">
      {navItems.map((item) => {
        const active = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded-md transition-colors ${
              active
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "hover:bg-neutral-200 dark:hover:bg-neutral-800"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

