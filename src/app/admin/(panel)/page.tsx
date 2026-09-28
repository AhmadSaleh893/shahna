import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import { localizedName } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { getOrderCounts, listRecentOrders } from "@/lib/orders";
import { getProductStats } from "@/lib/products";
import { StatusBadge } from "./status-badge";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  // The layout's title template only applies to nested pages, so spell this one out.
  return { title: { absolute: `${t.admin.dashboard.title} · ${t.admin.metaSuffix}` } };
}

export default async function AdminDashboard() {
  await requireAdmin();
  const [{ locale, t }, products, orders, recent] = await Promise.all([
    getI18n(),
    getProductStats(),
    getOrderCounts(),
    listRecentOrders(6),
  ]);
  const d = t.admin.dashboard;

  const stats = [
    { label: d.newOrders, value: orders.new, href: "/admin/orders?status=new", highlight: orders.new > 0 },
    { label: d.allOrders, value: orders.all, href: "/admin/orders" },
    { label: d.onSale, value: products.active, href: "/admin/products" },
    { label: d.outOfStock, value: products.outOfStock, href: "/admin/products" },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">{d.title}</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`rounded-3xl border p-5 transition hover:border-ink ${s.highlight ? "border-volt-deep bg-volt" : "border-line bg-card"}`}
          >
            <p className="text-sm text-ink/70">{s.label}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">{s.value}</p>
          </Link>
        ))}
      </div>

      {products.total === 0 && (
        <div className="mt-6 rounded-3xl border border-dashed border-line bg-card p-6">
          <p className="font-semibold">{d.noBikesTitle}</p>
          <p className="mt-1 text-sm text-muted">{d.noBikesText}</p>
          <Link href="/admin/products" className="btn-primary mt-4">
            {d.goToBikes}
          </Link>
        </div>
      )}

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{d.recent}</h2>
          <Link href="/admin/orders" className="text-sm font-medium hover:underline">
            {d.viewAll}
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-4 rounded-3xl border border-line bg-card p-6 text-sm text-muted">{d.noOrders}</p>
        ) : (
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-card">
            {recent.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 text-sm">
                <bdi className="font-mono font-semibold">{order.number}</bdi>
                <span className="min-w-0 flex-1 truncate">
                  {order.customer.name} · {order.items.map((i) => `${i.qty}× ${localizedName(i, locale)}`).join(locale === "ar" ? "، " : ", ")}
                </span>
                <span className="font-semibold tabular-nums">{formatPrice(order.total, locale)}</span>
                <StatusBadge status={order.status} t={t} />
                <span className="w-full text-muted sm:w-auto">{formatDate(order.createdAt, locale)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
