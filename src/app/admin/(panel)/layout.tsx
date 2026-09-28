import type { Metadata } from "next";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/i18n-provider";
import { BoltIcon } from "@/components/icons";
import { requireAdmin } from "@/lib/auth";
import { getI18n } from "@/lib/i18n/server";
import { logout } from "./actions";
import { AdminNav } from "./admin-nav";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: { default: t.admin.brand, template: `%s · ${t.admin.metaSuffix}` },
    robots: { index: false },
  };
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const { t } = await getI18n();
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="flex size-7 items-center justify-center rounded-full bg-volt">
              <BoltIcon width={14} height={14} />
            </span>
            {t.admin.brand}
          </Link>
          <AdminNav />
          <div className="ms-auto flex items-center gap-2">
            <Link href="/" target="_blank" className="rounded-full px-3 py-1.5 text-sm text-muted hover:text-ink">
              {t.admin.viewStore}
            </Link>
            <form action={logout}>
              <button type="submit" className="rounded-full px-3 py-1.5 text-sm text-muted hover:text-ink">
                {t.admin.signOut}
              </button>
            </form>
            <LanguageSwitcher />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
