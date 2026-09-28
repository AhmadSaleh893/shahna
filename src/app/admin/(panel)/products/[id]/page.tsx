import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { localizedName } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { getProductById } from "@/lib/products";
import { removeProduct } from "../../actions";
import { ProductForm } from "../product-form";
import { DeleteButton } from "./delete-button";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.form.editMeta };
}

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  await requireAdmin();
  const [{ locale, t }, product] = await Promise.all([getI18n(), params.then((p) => getProductById(p.id))]);
  if (!product) notFound();
  const name = localizedName(product, locale);

  return (
    <>
      <Link href="/admin/products" className="text-sm text-muted hover:text-ink">
        {t.admin.form.back}
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
        <div className="flex gap-2">
          {product.active && (
            <Link href={`/bikes/${product.slug}`} target="_blank" className="btn-outline">
              {t.admin.form.viewInStore}
            </Link>
          )}
          <DeleteButton action={removeProduct.bind(null, product.id)} name={name} />
        </div>
      </div>
      <ProductForm product={product} />
    </>
  );
}
