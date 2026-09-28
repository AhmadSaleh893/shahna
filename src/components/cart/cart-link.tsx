"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";
import { BagIcon } from "@/components/icons";
import { useCart } from "./cart-store";

export function CartLink() {
  const { count } = useCart();
  const { t } = useI18n();
  return (
    <Link
      href="/cart"
      className="relative inline-flex size-11 items-center justify-center rounded-full bg-ink text-paper transition hover:bg-ink-soft"
      aria-label={count > 0 ? t.nav.cartCount(count) : t.nav.cart}
    >
      <BagIcon />
      {count > 0 && (
        <span className="absolute -top-1 -end-1 flex min-w-5 items-center justify-center rounded-full bg-volt px-1 text-xs font-bold text-ink ring-2 ring-paper">
          {count}
        </span>
      )}
    </Link>
  );
}
