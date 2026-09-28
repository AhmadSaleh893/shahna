import type { Metadata } from "next";
import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { localizedName } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { listAllProducts } from "@/lib/products";
import { loadSampleProducts } from "../actions";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.products.title };
}

export default async function AdminProductsPage() {
  await requireAdmin();
  const [{ locale, t }, products] = await Promise.all([getI18n(), listAllProducts()]);
  const p = t.admin.products;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{p.title}</h1>
          <p className="mt-1 text-sm text-muted">{p.inCatalogue(products.length)}</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          {p.add}
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-line bg-card p-10 text-center">
          <p className="font-semibold">{p.noneTitle}</p>
          <p className="mt-1 text-sm text-muted">{p.noneText}</p>
          <form action={loadSampleProducts} className="mt-5">
            <button type="submit" className="btn-volt">
              {p.loadSamples}
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-card">
          <table className="w-full min-w-[640px] text-start text-sm">
            <thead className="border-b border-line text-xs text-muted uppercase">
              <tr>
                <th className="px-5 py-3 text-start font-medium">{p.columns.bike}</th>
                <th className="px-3 py-3 text-start font-medium">{p.columns.category}</th>
                <th className="px-3 py-3 text-end font-medium">{p.columns.price}</th>
                <th className="px-3 py-3 text-end font-medium">{p.columns.stock}</th>
                <th className="px-5 py-3 text-start font-medium">{p.columns.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-paper/60">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="flex items-center gap-3 font-semibold hover:underline"
                    >
                      <ProductImage
                        name={product.name}
                        category={product.category}
                        accentColor={product.accentColor}
                        imageUrl={product.imageUrl}
                        sizes="64px"
                        className="aspect-[4/3] w-16 shrink-0 rounded-xl"
                      />
                      {localizedName(product, locale)}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-muted">{t.categories[product.category]}</td>
                  <td className="px-3 py-3 text-end tabular-nums">{formatPrice(product.price, locale)}</td>
                  <td className={`px-3 py-3 text-end tabular-nums ${product.stock <= 0 ? "font-semibold text-danger" : ""}`}>
                    {product.stock}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          product.active ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"
                        }`}
                      >
                        {product.active ? p.visible : p.hidden}
                      </span>
                      {product.featured && (
                        <span className="rounded-full bg-volt px-2.5 py-0.5 text-xs font-semibold">{p.featured}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
