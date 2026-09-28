import { ar } from "./ar";
import { en } from "./en";

export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ar";
export const LOCALE_COOKIE = "lang";

export type Dictionary = typeof ar;
export const dictionaries: Record<Locale, Dictionary> = { ar, en };

export function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function textDirection(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

/** Locale tag for Intl formatters. Arabic keeps Western digits, as most local shops do. */
export function intlLocale(locale: Locale) {
  return locale === "ar" ? "ar-u-nu-latn" : "en-US";
}

/** Products are written in Arabic, with optional English translations. */
export function localizedName(item: { name: string; nameEn?: string | null }, locale: Locale) {
  return locale === "en" && item.nameEn ? item.nameEn : item.name;
}

export function localizedDescription(item: { description: string; descriptionEn?: string | null }, locale: Locale) {
  return locale === "en" && item.descriptionEn ? item.descriptionEn : item.description;
}
