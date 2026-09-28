"use client";

import Form from "next/form";
import { useI18n } from "@/components/i18n-provider";

export function ListingControls({
  category,
  search,
  sort,
  maxPrice,
  sortOptions,
  priceSteps,
}: {
  category?: string;
  search?: string;
  sort: string;
  maxPrice?: number;
  sortOptions: { value: string; label: string }[];
  priceSteps: { value: number; label: string }[];
}) {
  const { t } = useI18n();
  const submit = (e: React.ChangeEvent<HTMLSelectElement>) => e.currentTarget.form?.requestSubmit();
  return (
    <Form action="/bikes" className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {category && <input type="hidden" name="category" value={category} />}
      <label className="relative flex-1 sm:max-w-xs">
        <span className="sr-only">{t.listing.searchLabel}</span>
        <input
          type="search"
          name="q"
          defaultValue={search}
          placeholder={t.listing.searchPlaceholder}
          className="field rounded-full ps-10"
        />
        <svg
          className="pointer-events-none absolute top-1/2 start-3.5 size-4 -translate-y-1/2 text-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </label>
      <div className="flex gap-3">
        <label className="flex-1 sm:flex-none">
          <span className="sr-only">{t.listing.maxPriceLabel}</span>
          <select name="max" defaultValue={maxPrice ?? ""} onChange={submit} className="field rounded-full pe-8">
            <option value="">{t.listing.anyPrice}</option>
            {priceSteps.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex-1 sm:flex-none">
          <span className="sr-only">{t.listing.sortLabel}</span>
          <select name="sort" defaultValue={sort} onChange={submit} className="field rounded-full pe-8">
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </Form>
  );
}
