"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useTransition } from "react";
import { DEFAULT_LOCALE, dictionaries, type Locale } from "@/lib/i18n";
import { setLocale } from "@/lib/i18n/actions";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export function useI18n() {
  const locale = useContext(LocaleContext);
  return { locale, t: dictionaries[locale] };
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const next: Locale = locale === "ar" ? "en" : "ar";
  return (
    <button
      type="button"
      lang={next}
      aria-label={t.language.switchLabel}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await setLocale(next);
          router.refresh();
        })
      }
      className={`rounded-full border border-line bg-card px-3.5 py-2 text-sm font-medium transition hover:border-ink disabled:opacity-50 ${className}`}
    >
      {t.language.switchTo}
    </button>
  );
}
