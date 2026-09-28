import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";

export default async function NotFound() {
  const { t } = await getI18n();
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-mono text-sm font-semibold text-muted">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">{t.notFound.title}</h1>
      <p className="mt-3 text-muted">{t.notFound.text}</p>
      <Link href="/bikes" className="btn-primary mt-8 px-6 py-3">
        {t.notFound.cta}
      </Link>
    </main>
  );
}
