import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LanguageSwitcher } from "@/components/i18n-provider";
import { BoltIcon } from "@/components/icons";
import { isAdmin } from "@/lib/auth";
import { getI18n } from "@/lib/i18n/server";
import { LoginForm } from "./login-form";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.loginMeta, robots: { index: false } };
}

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  const { t } = await getI18n();
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-card p-8">
        <div className="flex items-center justify-between">
          <span className="flex size-10 items-center justify-center rounded-full bg-volt">
            <BoltIcon width={18} height={18} />
          </span>
          <LanguageSwitcher />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">{t.admin.loginTitle}</h1>
        <p className="mt-1 text-sm text-muted">{t.admin.loginText}</p>
        <LoginForm />
      </div>
    </main>
  );
}
