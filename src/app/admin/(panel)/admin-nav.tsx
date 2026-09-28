"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";

export function AdminNav() {
  const { t } = useI18n();
  const pathname = usePathname();
  const links = [
    { href: "/admin", label: t.admin.nav.dashboard },
    { href: "/admin/products", label: t.admin.nav.bikes },
    { href: "/admin/orders", label: t.admin.nav.orders },
  ];
  return (
    <nav className="flex gap-1" aria-label={t.admin.nav.label}>
      {links.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              active ? "bg-ink text-paper" : "text-ink-soft hover:bg-ink/5"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
