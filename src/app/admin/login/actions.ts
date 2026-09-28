"use server";

import { redirect } from "next/navigation";
import { checkAdminPassword, createAdminSession } from "@/lib/auth";
import { getI18n } from "@/lib/i18n/server";

export async function login(_prev: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  if (!checkAdminPassword(password)) {
    // Slow down password guessing a little.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: (await getI18n()).t.admin.wrongPassword };
  }
  await createAdminSession();
  redirect("/admin");
}
