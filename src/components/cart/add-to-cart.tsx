"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { CheckIcon, MinusIcon, PlusIcon } from "@/components/icons";
import { cart, MAX_QTY, type CartItem } from "./cart-store";

export function AddToCart({ item, stock }: { item: Omit<CartItem, "qty">; stock: number }) {
  const { t } = useI18n();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const max = Math.min(stock, MAX_QTY);

  if (stock <= 0) {
    return (
      <button type="button" disabled className="btn-primary w-full py-3.5">
        {t.product.outOfStock}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <QtyStepper value={qty} max={max} onChange={setQty} />
        <button
          type="button"
          className="btn-primary flex-1 py-3.5"
          onClick={() => {
            cart.add(item, qty);
            setAdded(true);
          }}
        >
          {added ? (
            <>
              <CheckIcon /> {t.product.added}
            </>
          ) : (
            t.product.addToCart
          )}
        </button>
      </div>
      {added && (
        <Link href="/cart" className="btn-volt w-full py-3.5">
          {t.product.goToCart}
        </Link>
      )}
    </div>
  );
}

export function QtyStepper({
  value,
  max = MAX_QTY,
  onChange,
  size = "md",
}: {
  value: number;
  max?: number;
  onChange: (qty: number) => void;
  size?: "sm" | "md";
}) {
  const { t } = useI18n();
  const btn = size === "sm" ? "size-8" : "size-11";
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-card">
      <button
        type="button"
        className={`${btn} inline-flex items-center justify-center rounded-full text-ink transition hover:bg-paper disabled:opacity-30`}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={t.product.decrease}
      >
        <MinusIcon width={16} height={16} />
      </button>
      <span className="w-7 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={`${btn} inline-flex items-center justify-center rounded-full text-ink transition hover:bg-paper disabled:opacity-30`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={t.product.increase}
      >
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  );
}
