"use client";

import { useActionState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { login } from "./actions";

export function LoginForm() {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(login, {});
  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label htmlFor="password" className="label">
          {t.admin.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="field"
        />
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full py-3">
        {pending ? t.admin.signingIn : t.admin.signIn}
      </button>
    </form>
  );
}
