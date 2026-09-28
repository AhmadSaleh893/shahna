"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { destroyAdminSession, requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { getI18n } from "@/lib/i18n/server";
import { setOrderStatus } from "@/lib/orders";
import { createProduct, deleteProduct, insertProducts, updateProduct } from "@/lib/products";
import { SAMPLE_PRODUCTS } from "@/lib/sample-products";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";
import { fieldErrors, productFromForm } from "@/lib/validation";

export type ProductFormState = { message?: string; errors?: Record<string, string> };

function isDuplicateKey(err: unknown) {
  return typeof err === "object" && err !== null && (err as { code?: number }).code === 11000;
}

export async function saveProduct(
  productId: string | null,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();
  const { t } = await getI18n();
  const e = t.admin.form.errors;

  const parsed = productFromForm(formData, t);
  if (!parsed.success) return { message: e.fix, errors: fieldErrors(parsed.error) };

  const input = parsed.data;
  // Arabic names don't produce a Latin slug, so prefer the English name.
  input.slug = input.slug || slugify(input.nameEn ?? "") || slugify(input.name) || `bike-${Date.now().toString(36)}`;
  if (input.compareAtPrice !== null && input.compareAtPrice <= input.price) {
    return { message: e.fix, errors: { compareAtPrice: e.compareAt } };
  }

  try {
    if (productId) {
      const found = await updateProduct(productId, input);
      if (!found) return { message: e.notExists };
    } else {
      await createProduct(input);
    }
  } catch (err) {
    if (isDuplicateKey(err)) return { message: e.fix, errors: { slug: e.slugTaken } };
    throw err;
  }

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function removeProduct(productId: string) {
  await requireAdmin();
  await deleteProduct(productId);
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function loadSampleProducts() {
  await requireAdmin();
  await insertProducts(SAMPLE_PRODUCTS);
  revalidatePath("/", "layout");
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status"));
  if (!ORDER_STATUSES.includes(status as OrderStatus)) return;
  await setOrderStatus(String(formData.get("orderId")), status as OrderStatus);
  revalidatePath("/admin", "layout");
}

export async function logout() {
  await destroyAdminSession();
  redirect("/admin/login");
}
