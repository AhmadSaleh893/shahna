import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { formatPrice } from "@/lib/format";
import { getI18n } from "@/lib/i18n/server";
import { listProducts, SORT_OPTIONS, type SortKey } from "@/lib/products";
import { CATEGORIES, type Category } from "@/lib/types";
import { ListingControls } from "./listing-controls";

export const dynamic = "force-dynamic";

// Price filter options, in ILS.
const PRICE_STEPS = [4000, 6000, 8000, 12000];

function pick(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseParams(params: Record<string, string | string[] | undefined>) {
  const categoryParam = pick(params.category);
  const sortParam = pick(params.sort);
  const max = Number(pick(params.max));
  return {
    category: CATEGORIES.includes(categoryParam as Category) ? (categoryParam as Category) : undefined,
    sort: (sortParam && sortParam in SORT_OPTIONS ? sortParam : "featured") as SortKey,
    maxPrice: Number.isFinite(max) && max > 0 ? max : undefined,
    search: pick(params.q)?.trim().slice(0, 60) || undefined,
  };
}

export async function generateMetadata({ searchParams }: PageProps<"/bikes">): Promise<Metadata> {
  const [{ category }, { t }] = await Promise.all([searchParams.then(parseParams), getI18n()]);
  return {
    title: category ? t.categoryTitles[category] : t.listing.allTitle,
    description: category ? t.categoryBlurbs[category] : t.listing.allMeta,
  };
}

export default async function BikesPage({ searchParams }: PageProps<"/bikes">) {
  const query = parseParams(await searchParams);
  const [{ locale, t }, products] = await Promise.all([getI18n(), listProducts(query)]);

  const hrefFor = (category?: Category) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (query.sort !== "featured") params.set("sort", query.sort);
    if (query.maxPrice) params.set("max", String(query.maxPrice));
    if (query.search) params.set("q", query.search);
    const qs = params.toString();
    return qs ? `/bikes?${qs}` : "/bikes";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {query.category ? t.categoryTitles[query.category] : t.listing.allTitle}
        </h1>
        <p className="mt-2 text-muted">{query.category ? t.categoryBlurbs[query.category] : t.listing.allSubtitle}</p>
      </header>

      <div className="mt-8 flex flex-col gap-4 border-b border-line pb-6">
        <nav className="flex flex-wrap gap-2" aria-label={t.listing.categoriesLabel}>
          <CategoryChip href={hrefFor()} active={!query.category}>
            {t.listing.all}
          </CategoryChip>
          {CATEGORIES.map((c) => (
            <CategoryChip key={c} href={hrefFor(c)} active={query.category === c}>
              {t.categories[c]}
            </CategoryChip>
          ))}
        </nav>
        <ListingControls
          // Remount when the URL changes so inputs reflect the current filters.
          key={JSON.stringify(query)}
          category={query.category}
          search={query.search}
          sort={query.sort}
          maxPrice={query.maxPrice}
          sortOptions={(Object.keys(SORT_OPTIONS) as SortKey[]).map((value) => ({ value, label: t.listing.sort[value] }))}
          priceSteps={PRICE_STEPS.map((v) => ({ value: v, label: t.listing.under(formatPrice(v, locale)) }))}
        />
      </div>

      <p className="mt-6 text-sm text-muted">
        {t.bikes(products.length)}
        {query.search && <> {t.listing.matching(query.search)}</>}
      </p>

      {products.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} locale={locale} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-3xl border border-dashed border-line bg-card px-6 py-16 text-center">
          <p className="font-semibold">{t.listing.noMatch}</p>
          <Link href="/bikes" className="btn-outline mt-5">
            {t.listing.clear}
          </Link>
        </div>
      )}
    </div>
  );
}

function CategoryChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active ? "bg-ink text-paper" : "border border-line bg-card text-ink hover:border-ink"
      }`}
    >
      {children}
    </Link>
  );
}
