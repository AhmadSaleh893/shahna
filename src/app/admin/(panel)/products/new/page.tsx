import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getI18n } from "@/lib/i18n/server";
import { ProductForm } from "../product-form";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.form.newMeta };
}

export default async function NewProductPage() {
  await requireAdmin();
  const { t } = await getI18n();
  return (
    <>
      <Link href="/admin/products" className="text-sm text-muted hover:text-ink">
        {t.admin.form.back}
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">{t.admin.form.newTitle}</h1>
      <ProductForm />
    </>
  );
}
