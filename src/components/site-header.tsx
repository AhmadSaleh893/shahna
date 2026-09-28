import Link from "next/link";
import { CartLink } from "./cart/cart-link";
import { LanguageSwitcher } from "./i18n-provider";
import { BoltIcon } from "./icons";
import { getI18n } from "@/lib/i18n/server";
import { CATEGORIES } from "@/lib/types";

export async function SiteHeader() {
  const { t } = await getI18n();
  const nav = [
    { href: "/bikes", label: t.nav.allBikes },
    ...CATEGORIES.slice(0, 4).map((c) => ({ href: `/bikes?category=${c}`, label: t.categories[c] })),
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-full bg-volt text-ink">
            <BoltIcon width={16} height={16} />
          </span>
          {t.site.name}
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label={t.nav.main}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition hover:bg-ink/5 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <LanguageSwitcher />
          <CartLink />
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-4 pb-2.5 [scrollbar-width:none] md:hidden" aria-label={t.nav.main}>
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full border border-line bg-card px-3.5 py-1.5 text-sm font-medium"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
