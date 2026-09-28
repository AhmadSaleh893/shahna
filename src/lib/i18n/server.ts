import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { DEFAULT_LOCALE, dictionaries, isLocale, LOCALE_COOKIE } from ".";

/** Current visitor's language, from the `lang` cookie. Arabic unless they switched. */
export const getLocale = cache(async () => {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
});

export async function getI18n() {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}
