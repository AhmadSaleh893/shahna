"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect } from "react";
import { QtyStepper } from "@/components/cart/add-to-cart";
import { cart, useCart, useHydrated } from "@/components/cart/cart-store";
import { useI18n } from "@/components/i18n-provider";
import { CheckIcon, TrashIcon, WhatsAppIcon } from "@/components/icons";
import { ProductImage } from "@/components/product-image";
import { formatPrice } from "@/lib/format";
import { localizedName } from "@/lib/i18n";
import { placeOrder, type CheckoutState } from "./actions";

export function CartView() {
  const { locale, t } = useI18n();
  const hydrated = useHydrated();
  const { items, count, subtotal } = useCart();
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(placeOrder, { status: "idle" });

  useEffect(() => {
    if (state.status === "success") cart.clear();
  }, [state.status]);

  if (state.status === "success") return <OrderPlaced {...state} />;

  if (!hydrated) {
    return <div className="h-96 animate-pulse rounded-3xl bg-line/40" aria-label={t.cart.loading} />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t.cart.emptyTitle}</h1>
        <p className="mt-3 text-muted">{t.cart.emptyText}</p>
        <Link href="/bikes" className="btn-primary mt-8 px-6 py-3">
          {t.cart.browse}
        </Link>
      </div>
    );
  }

  const errors = state.status === "error" ? (state.errors ?? {}) : {};
  const f = t.cart.fields;

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.cart.title}</h1>
      <p className="mt-2 text-muted">{t.cart.items(count)}</p>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
        <ul className="divide-y divide-line rounded-3xl border border-line bg-card">
          {items.map((item) => {
            const name = localizedName(item, locale);
            return (
              <li key={item.productId} className="flex gap-4 p-4 sm:p-5">
                <Link href={`/bikes/${item.slug}`} className="shrink-0">
                  <ProductImage
                    name={name}
                    category={item.category}
                    accentColor={item.accentColor}
                    imageUrl={item.imageUrl}
                    sizes="128px"
                    className="aspect-[4/3] w-24 rounded-2xl sm:w-32"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/bikes/${item.slug}`} className="font-semibold hover:underline">
                        {name}
                      </Link>
                      <p className="text-sm text-muted">{t.categories[item.category] ?? ""}</p>
                    </div>
                    <p className="font-semibold tabular-nums">{formatPrice(item.price * item.qty, locale)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <QtyStepper size="sm" value={item.qty} onChange={(qty) => cart.setQty(item.productId, qty)} />
                    <button
                      type="button"
                      onClick={() => cart.remove(item.productId)}
                      className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-danger"
                    >
                      <TrashIcon width={16} height={16} /> {t.cart.remove}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <form
          className="rounded-3xl border border-line bg-card p-5 sm:p-6 lg:sticky lg:top-24"
          // Submit manually so the form keeps what the customer typed if validation fails.
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            data.set("items", JSON.stringify(items.map((i) => ({ productId: i.productId, qty: i.qty }))));
            startTransition(() => formAction(data));
          }}
          noValidate
        >
          <h2 className="text-lg font-semibold">{t.cart.detailsTitle}</h2>
          <p className="mt-1 text-sm text-muted">{t.cart.detailsText}</p>

          <div className="mt-5 space-y-4">
            <Field label={f.name} name="name" autoComplete="name" error={errors["customer.name"]} required />
            <Field
              label={f.phone}
              name="phone"
              type="tel"
              dir="ltr"
              className="rtl:text-right"
              autoComplete="tel"
              error={errors["customer.phone"]}
              required
            />
            <Field label={f.city} name="city" autoComplete="address-level2" error={errors["customer.city"]} required />
            <Field
              label={f.address}
              name="address"
              autoComplete="street-address"
              optional={t.cart.optional}
              error={errors["customer.address"]}
            />
            <div>
              <label htmlFor="notes" className="label">
                {f.notes} <span className="font-normal text-muted">{t.cart.optional}</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                maxLength={500}
                className="field resize-none"
                placeholder={t.cart.notesPlaceholder}
              />
            </div>
          </div>

          <dl className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">{t.cart.subtotal}</dt>
              <dd className="tabular-nums">{formatPrice(subtotal, locale)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">{t.cart.delivery}</dt>
              <dd>{t.cart.deliveryValue}</dd>
            </div>
            <div className="flex justify-between pt-2 text-base font-bold">
              <dt>{t.cart.total}</dt>
              <dd className="tabular-nums">{formatPrice(subtotal, locale)}</dd>
            </div>
          </dl>

          {state.status === "error" && (
            <p role="alert" className="mt-4 rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">
              {state.message}
            </p>
          )}

          <button type="submit" disabled={pending} className="btn-whatsapp mt-5 w-full py-3.5 text-base">
            <WhatsAppIcon /> {pending ? t.cart.placing : t.cart.place}
          </button>
        </form>
      </div>
    </>
  );
}

function Field({
  label,
  name,
  error,
  optional,
  className = "",
  ...props
}: {
  label: string;
  name: string;
  error?: string;
  optional?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="label">
        {label} {optional && <span className="font-normal text-muted">{optional}</span>}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`field ${error ? "border-danger" : ""} ${className}`}
        {...props}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function OrderPlaced({ orderNumber, total, whatsappUrl }: { orderNumber: string; total: number; whatsappUrl: string | null }) {
  const { locale, t } = useI18n();
  return (
    <div className="mx-auto max-w-lg py-10 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-volt">
        <CheckIcon width={28} height={28} />
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">{t.cart.doneTitle}</h1>
      <p className="mt-3 text-muted">
        {t.cart.orderLabel}{" "}
        <bdi className="font-mono font-semibold text-ink">{orderNumber}</bdi> ({formatPrice(total, locale)}).{" "}
        {whatsappUrl ? t.cart.doneWithWhatsapp : t.cart.doneWithoutWhatsapp}
      </p>
      {whatsappUrl && (
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp mt-8 w-full py-4 text-base">
          <WhatsAppIcon /> {t.cart.sendWhatsapp}
        </a>
      )}
      <Link href="/bikes" className="btn-outline mt-3 w-full py-3.5">
        {t.cart.keepBrowsing}
      </Link>
    </div>
  );
}
