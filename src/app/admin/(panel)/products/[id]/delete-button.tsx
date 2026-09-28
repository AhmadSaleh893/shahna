"use client";

import { useFormStatus } from "react-dom";
import { useI18n } from "@/components/i18n-provider";

export function DeleteButton({ action, name }: { action: () => Promise<void>; name: string }) {
  const { t } = useI18n();
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(t.admin.form.deleteConfirm(name))) e.preventDefault();
      }}
    >
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { t } = useI18n();
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn border border-danger/30 bg-card text-danger hover:bg-danger/5">
      {pending ? t.admin.form.deleting : t.admin.form.delete}
    </button>
  );
}
