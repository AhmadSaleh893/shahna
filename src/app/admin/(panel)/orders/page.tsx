import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import { localizedName } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { getOrderCounts, listOrders } from "@/lib/orders";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";
import { updateOrderStatus } from "../actions";
import { StatusBadge } from "../status-badge";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.orders.title };
}

export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  await requireAdmin();
  const statusParam = (await searchParams).status;
  const status = ORDER_STATUSES.includes(statusParam as OrderStatus) ? (statusParam as OrderStatus) : undefined;
  const [{ locale, t }, orders, counts] = await Promise.all([getI18n(), listOrders(status), getOrderCounts()]);
  const o = t.admin.orders;

  const tabs: { key: OrderStatus | "all"; label: string; href: string }[] = [
    { key: "all", label: o.all, href: "/admin/orders" },
    ...ORDER_STATUSES.map((s) => ({ key: s, label: t.admin.statuses[s], href: `/admin/orders?status=${s}` })),
  ];

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">{o.title}</h1>
      <p className="mt-1 text-sm text-muted">{o.intro}</p>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label={o.filterLabel}>
        {tabs.map((tab) => {
          const active = (status ?? "all") === tab.key;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${active ? "bg-ink text-paper" : "border border-line bg-card hover:border-ink"}`}
            >
              {tab.label} <span className="ms-1 tabular-nums opacity-60">{counts[tab.key]}</span>
            </Link>
          );
        })}
      </nav>

      {orders.length === 0 ? (
        <p className="mt-6 rounded-3xl border border-line bg-card p-8 text-center text-sm text-muted">{o.none}</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((order) => (
            <li key={order.id} className="rounded-3xl border border-line bg-card p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <bdi className="font-mono font-semibold">{order.number}</bdi>
                <StatusBadge status={order.status} t={t} />
                <span className="text-sm text-muted">{formatDate(order.createdAt, locale)}</span>
                <span className="ms-auto text-lg font-bold tabular-nums">{formatPrice(order.total, locale)}</span>
              </div>

              <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                <ul className="space-y-1">
                  {order.items.map((item) => (
                    <li key={item.productId} className="flex justify-between gap-3">
                      <span>
                        {item.qty} × {localizedName(item, locale)}
                      </span>
                      <span className="text-muted tabular-nums">{formatPrice(item.price * item.qty, locale)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                  <dt className="text-muted">{o.name}</dt>
                  <dd>{order.customer.name}</dd>
                  <dt className="text-muted">{o.phone}</dt>
                  <dd>
                    <a
                      href={`tel:${order.customer.phone.replace(/[^\d+]/g, "")}`}
                      dir="ltr"
                      className="font-medium hover:underline"
                    >
                      {order.customer.phone}
                    </a>
                  </dd>
                  <dt className="text-muted">{o.city}</dt>
                  <dd>{order.customer.city}</dd>
                  {order.customer.address && (
                    <>
                      <dt className="text-muted">{o.address}</dt>
                      <dd>{order.customer.address}</dd>
                    </>
                  )}
                  {order.customer.notes && (
                    <>
                      <dt className="text-muted">{o.notes}</dt>
                      <dd className="whitespace-pre-line">{order.customer.notes}</dd>
                    </>
                  )}
                </dl>
              </div>

              <form action={updateOrderStatus} className="mt-4 flex items-center gap-2 border-t border-line pt-4">
                <input type="hidden" name="orderId" value={order.id} />
                <label htmlFor={`status-${order.id}`} className="text-sm text-muted">
                  {o.status}
                </label>
                <select id={`status-${order.id}`} name="status" defaultValue={order.status} className="field w-auto py-1.5">
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {t.admin.statuses[s]}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn-outline py-1.5">
                  {o.update}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
