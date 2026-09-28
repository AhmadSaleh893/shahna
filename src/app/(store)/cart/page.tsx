import type { Metadata } from "next";
import { getI18n } from "@/lib/i18n/server";
import { CartView } from "./cart-view";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.cart.meta };
}

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <CartView />
    </div>
  );
}
