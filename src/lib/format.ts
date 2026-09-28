import { intlLocale, type Locale } from "./i18n";
import { CURRENCY, site } from "./site";

const priceFormatters = new Map<Locale, Intl.NumberFormat>();

export function formatPrice(amount: number, locale: Locale) {
  let formatter = priceFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.NumberFormat(intlLocale(locale), {
      style: "currency",
      currency: CURRENCY,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    priceFormatters.set(locale, formatter);
  }
  // In right-to-left text a Latin symbol like "US$" gets reordered to "$US";
  // wrapping it in a left-to-right isolate keeps it intact.
  return formatter
    .formatToParts(amount)
    .map((part) => (part.type === "currency" && /[A-Za-z]/.test(part.value) ? `⁦${part.value}⁩` : part.value))
    .join("");
}

export function formatDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: site.timeZone,
  }).format(date);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
