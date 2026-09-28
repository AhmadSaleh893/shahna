import Link from "next/link";
import { ProductImage } from "./product-image";
import { formatPrice } from "@/lib/format";
import { dictionaries, localizedName, type Locale } from "@/lib/i18n";
import type { Product } from "@/lib/types";

export function ProductCard({ product, locale, priority }: { product: Product; locale: Locale; priority?: boolean }) {
  const t = dictionaries[locale];
  const name = localizedName(product, locale);
  const onSale = product.compareAtPrice !== null && product.compareAtPrice > product.price;
  return (
    <Link
      href={`/bikes/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-card transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-16px_rgba(18,22,19,0.25)]"
    >
      <div className="relative">
        <ProductImage
          name={name}
          category={product.category}
          accentColor={product.accentColor}
          imageUrl={product.imageUrl}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="aspect-[4/3] transition duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute top-3 start-3 flex gap-1.5">
          {onSale && <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-volt">{t.product.sale}</span>}
          {product.stock <= 0 && (
            <span className="rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-muted">{t.product.soldOut}</span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted uppercase">{t.categories[product.category]}</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">{name}</h3>
        </div>
        <dl className="flex gap-4 text-xs text-muted">
          <div className="flex gap-1">
            <dt>{t.product.specs.range}</dt>
            <dd className="font-semibold text-ink">
              {product.specs.rangeKm} {t.units.km}
            </dd>
          </div>
          <div className="flex gap-1">
            <dt>{t.product.specs.motor}</dt>
            <dd className="font-semibold text-ink">
              {product.specs.motorWatts} {t.units.w}
            </dd>
          </div>
        </dl>
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-bold">{formatPrice(product.price, locale)}</span>
          {onSale && (
            <span className="text-sm text-muted line-through">{formatPrice(product.compareAtPrice!, locale)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
