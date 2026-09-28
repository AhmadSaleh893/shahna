import type { Dictionary } from "@/lib/i18n";
import type { OrderStatus } from "@/lib/types";

const STYLES: Record<OrderStatus, string> = {
  new: "bg-volt text-ink",
  contacted: "bg-sky-100 text-sky-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-stone-200 text-stone-600",
};

export function StatusBadge({ status, t }: { status: OrderStatus; t: Dictionary }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STYLES[status]}`}>
      {t.admin.statuses[status]}
    </span>
  );
}
