import "server-only";
import { formatPrice } from "./format";
import { dictionaries, localizedName, type Locale } from "./i18n";
import type { Order } from "./types";

function whatsappNumber() {
  return (process.env.WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
}

export function whatsappLink(text: string) {
  const number = whatsappNumber();
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** The order as a ready-to-send WhatsApp message, in the customer's language. */
export function orderMessage(order: Order, locale: Locale) {
  const m = dictionaries[locale].cart.message;
  const lines = [
    m.greeting,
    "",
    `${m.order}: ${order.number}`,
    ...order.items.map(
      (item) => `• ${item.qty} × ${localizedName(item, locale)} — ${formatPrice(item.price * item.qty, locale)}`,
    ),
    `${m.total}: ${formatPrice(order.total, locale)}`,
    "",
    `${m.name}: ${order.customer.name}`,
    `${m.phone}: ${order.customer.phone}`,
    `${m.city}: ${order.customer.city}`,
  ];
  if (order.customer.address) lines.push(`${m.address}: ${order.customer.address}`);
  if (order.customer.notes) lines.push(`${m.notes}: ${order.customer.notes}`);
  return lines.join("\n");
}
