import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { AddToCart } from "@/components/cart/add-to-cart";
import { WhatsAppIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import { formatPrice } from "@/lib/format";
import { localizedDescription, localizedName } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { getProductBySlug, listRelatedProducts } from "@/lib/products";
import { whatsappLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

// Shared by generateMetadata and the page so the product is fetched once per request.
const loadProduct = cache(getProductBySlug);

export async function generateMetadata({ params }: PageProps<"/bikes/[slug]">): Promise<Metadata> {
  const [product, { locale, t }] = await Promise.all([params.then((p) => loadProduct(p.slug)), getI18n()]);
  if (!product) return { title: t.product.notFound };
  return {
    title: localizedName(product, locale),
    description: localizedDescription(product, locale).slice(0, 155),
  };
}

export default async function ProductPage({ params }: PageProps<"/bikes/[slug]">) {
  const product = await loadProduct((await params).slug);
  if (!product) notFound();

  const [{ locale, t }, related, requestHeaders] = await Promise.all([
    getI18n(),
    listRelatedProducts(product),
    headers(),
  ]);
  const name = localizedName(product, locale);
  const host = requestHeaders.get("host");
  const proto = requestHeaders.get("x-forwarded-proto") ?? "https";
  const pageUrl = host ? `${proto}://${host}/bikes/${product.slug}` : `/bikes/${product.slug}`;
  const ask = whatsappLink(t.product.inquiry(name, pageUrl));

  const onSale = product.compareAtPrice !== null && product.compareAtPrice > product.price;
  const specs = [
    { label: t.product.specs.range, value: `${product.specs.rangeKm} ${t.units.km}` },
    { label: t.product.specs.motor, value: `${product.specs.motorWatts} ${t.units.w}` },
    { label: t.product.specs.battery, value: `${product.specs.batteryWh} ${t.units.wh}` },
    { label: t.product.specs.topSpeed, value: `${product.specs.topSpeedKmh} ${t.units.kmh}` },
    { label: t.product.specs.weight, value: `${product.specs.weightKg} ${t.units.kg}` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-10">
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/bikes" className="hover:text-ink">
          {t.product.breadcrumb}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/bikes?category=${product.category}`} className="hover:text-ink">
          {t.categories[product.category]}
        </Link>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        <ProductImage
          name={name}
          category={product.category}
          accentColor={product.accentColor}
          imageUrl={product.imageUrl}
          sizes="(min-width: 1024px) 55vw, 100vw"
          priority
          className="aspect-[4/3] rounded-[2rem] border border-line bg-card"
        />

        <div className="lg:py-4">
          <p className="text-sm font-medium tracking-wide text-muted uppercase">
            {product.brand} · {t.categories[product.category]}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{name}</h1>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price, locale)}</span>
            {onSale && (
              <>
                <span className="text-lg text-muted line-through">{formatPrice(product.compareAtPrice!, locale)}</span>
                <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-volt">
                  {t.product.save(formatPrice(product.compareAtPrice! - product.price, locale))}
                </span>
              </>
            )}
          </div>

          <p className="mt-3 flex items-center gap-2 text-sm font-medium">
            <span className={`size-2 rounded-full ${product.stock > 0 ? "bg-success" : "bg-danger"}`} />
            {product.stock > 5
              ? t.product.inStock
              : product.stock > 0
                ? t.product.onlyLeft(product.stock)
                : t.product.outOfStock}
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5">
            {specs.map((s) => (
              <div key={s.label} className="rounded-2xl border border-line bg-card p-3">
                <dt className="text-xs text-muted">{s.label}</dt>
                <dd className="mt-1 text-sm font-semibold">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <AddToCart
              stock={product.stock}
              item={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                nameEn: product.nameEn,
                category: product.category,
                price: product.price,
                accentColor: product.accentColor,
                imageUrl: product.imageUrl,
              }}
            />
            {ask && (
              <a href={ask} target="_blank" rel="noopener noreferrer" className="btn-outline mt-3 w-full py-3.5">
                <WhatsAppIcon className="text-whatsapp" /> {t.product.ask}
              </a>
            )}
          </div>

          <div className="mt-10 border-t border-line pt-8">
            <h2 className="font-semibold">{t.product.about}</h2>
            <p className="mt-3 leading-relaxed whitespace-pre-line text-ink-soft">
              {localizedDescription(product, locale)}
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold tracking-tight">{t.product.related}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
