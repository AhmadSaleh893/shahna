import Link from "next/link";
import { BikeArt } from "@/components/bike-art";
import { ArrowRightIcon, BikeIcon, ShieldIcon, TruckIcon, WhatsAppIcon, WrenchIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { getI18n } from "@/lib/i18n/server";
import { getCategoryCounts, listFeaturedProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/types";
import { whatsappLink } from "@/lib/whatsapp";

// Product data lives in the database and is edited from /admin, so render on each request.
export const dynamic = "force-dynamic";

const CATEGORY_ACCENTS = {
  city: "#c8f031",
  mountain: "#ff7a1a",
  folding: "#3ad6c5",
  cargo: "#ffc93c",
  road: "#7b8cff",
} as const;

const PERK_ICONS = [BikeIcon, ShieldIcon, WrenchIcon, TruckIcon];

export default async function HomePage() {
  const [{ locale, t }, featured, counts] = await Promise.all([getI18n(), listFeaturedProducts(4), getCategoryCounts()]);
  const chat = whatsappLink(t.home.adviceMessage);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink text-paper">
          <div className="grid items-center gap-6 px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:py-20">
            <div className="relative z-10">
              <p className="inline-flex items-center gap-2 rounded-full border border-paper/15 px-3 py-1 text-xs font-medium text-paper/75">
                <span className="size-1.5 rounded-full bg-volt" /> {t.home.badge}
              </p>
              <h1 className="mt-6 text-4xl leading-tight font-bold tracking-tight text-balance sm:text-6xl">
                {t.home.titleStart} <span className="text-volt">{t.home.titleEnd}</span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-paper/70 sm:text-lg">
                {t.site.tagline}. {t.home.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/bikes" className="btn-volt px-6 py-3">
                  {t.home.shop} <ArrowRightIcon width={16} height={16} />
                </Link>
                {chat && (
                  <a
                    href={chat}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn border border-paper/20 px-6 py-3 text-paper hover:border-paper/60"
                  >
                    <WhatsAppIcon /> {t.home.advice}
                  </a>
                )}
              </div>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-paper/10 pt-6">
                {t.home.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-xs text-paper/50">{stat.label}</dt>
                    <dd className="mt-1 text-sm font-semibold sm:text-base">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative -mx-6 sm:mx-0">
              <div className="absolute inset-x-8 top-1/2 aspect-square -translate-y-1/2 rounded-full bg-volt/15 blur-3xl" />
              <BikeArt category="city" accent="#d4fb3a" className="relative w-full text-paper" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <SectionHeading title={t.home.findTitle} subtitle={t.home.findSubtitle} />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/bikes?category=${c}`}
              className="group flex flex-col rounded-3xl border border-line bg-card p-4 transition hover:border-ink sm:p-5"
            >
              <div className="rounded-2xl p-2" style={{ background: `${CATEGORY_ACCENTS[c]}26` }}>
                <BikeArt category={c} accent={CATEGORY_ACCENTS[c]} className="w-full text-ink" />
              </div>
              <h3 className="mt-4 font-semibold tracking-tight">{t.categories[c]}</h3>
              <p className="mt-1 hidden text-sm leading-snug text-muted sm:block">{t.categoryBlurbs[c]}</p>
              <p className="mt-3 text-xs font-medium text-muted">{t.bikes(counts[c] ?? 0)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading title={t.home.popularTitle} subtitle={t.home.popularSubtitle} />
          <Link href="/bikes" className="hidden items-center gap-1.5 text-sm font-semibold hover:underline sm:inline-flex">
            {t.home.viewAll} <ArrowRightIcon width={16} height={16} />
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} locale={locale} priority={i < 2} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-line bg-card p-10 text-center text-muted">
            {t.home.empty}
          </div>
        )}
      </section>

      {/* Perks */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.home.perks.map(({ title, text }, i) => {
            const Icon = PERK_ICONS[i];
            return (
              <div key={title} className="rounded-3xl border border-line bg-card p-6">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-volt">
                  <Icon />
                </span>
                <h3 className="mt-5 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How ordering works */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <div className="rounded-[2rem] bg-volt p-8 sm:p-12">
          <SectionHeading title={t.home.orderingTitle} subtitle={t.home.orderingSubtitle} />
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {t.home.steps.map(({ title, text }, i) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-sm font-bold text-volt">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink/70">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-1.5 text-muted">{subtitle}</p>
    </div>
  );
}
