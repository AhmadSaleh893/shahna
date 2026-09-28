"use server";

import { localizedName } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { createOrder } from "@/lib/orders";
import { getActiveProductsByIds } from "@/lib/products";
import type { OrderItem } from "@/lib/types";
import { fieldErrors, parseCheckout } from "@/lib/validation";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";

export type CheckoutState =
  | { status: "idle" }
  | { status: "error"; message: string; errors?: Record<string, string> }
  | { status: "success"; orderNumber: string; total: number; whatsappUrl: string | null };

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const { locale, t } = await getI18n();
  let items: unknown;
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    items = [];
  }

  const parsed = parseCheckout(
    {
      items,
      customer: {
        name: formData.get("name") ?? "",
        phone: formData.get("phone") ?? "",
        city: formData.get("city") ?? "",
        address: formData.get("address") ?? "",
        notes: formData.get("notes") ?? "",
      },
    },
    t,
  );
  if (!parsed.success) {
    return { status: "error", message: t.cart.errors.checkFields, errors: fieldErrors(parsed.error) };
  }

  // Prices and availability always come from the database, never from the browser.
  const { customer } = parsed.data;
  const requested = parsed.data.items;
  const products = new Map(
    (await getActiveProductsByIds(requested.map((i) => i.productId))).map((p) => [p.id, p]),
  );

  const orderItems: OrderItem[] = [];
  for (const { productId, qty } of requested) {
    const product = products.get(productId);
    if (!product) return { status: "error", message: t.cart.errors.unavailable };
    if (product.stock < qty) {
      const name = localizedName(product, locale);
      return {
        status: "error",
        message: product.stock > 0 ? t.cart.errors.lowStock(product.stock, name) : t.cart.errors.soldOut(name),
      };
    }
    orderItems.push({
      productId,
      slug: product.slug,
      name: product.name,
      nameEn: product.nameEn,
      price: product.price,
      qty,
    });
  }

  const order = await createOrder(orderItems, customer);
  return {
    status: "success",
    orderNumber: order.number,
    total: order.total,
    whatsappUrl: whatsappLink(orderMessage(order, locale)),
  };
}
