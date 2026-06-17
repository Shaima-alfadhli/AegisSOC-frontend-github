"use client";

import { useMemo } from "react";
import type { ActivityItem } from "@/lib/api";
import { useSearch } from "@/components/providers/SearchProvider";
import { useT } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils/cn";
import { formatTimeFromIso } from "@/lib/utils/formatTime";
import { textMatches } from "@/lib/search";
import { Bug, Lock, ShieldAlert, UserCog } from "lucide-react";

function iconFor(kind: string) {
  const k = kind.toLowerCase();
  if (k.includes("blocked") || k.includes("login")) return Lock;
  if (k.includes("risk")) return ShieldAlert;
  if (k.includes("device")) return UserCog;
  if (k.includes("malware")) return Bug;
  return ShieldAlert;
}

function iconColor(kind: string) {
  const k = kind.toLowerCase();
  if (k.includes("blocked"))
    return "bg-red-500/15 text-red-200 border-red-500/25";
  if (k.includes("risk"))
    return "bg-amber-400/15 text-amber-100 border-amber-400/25";
  if (k.includes("device"))
    return "bg-cyan-400/15 text-cyan-100 border-cyan-400/25";
  if (k.includes("malware"))
    return "bg-emerald-500/15 text-emerald-200 border-emerald-500/25";
  return "bg-white/5 text-white/70 border-white/10";
}

export function LiveActivityFeed({
  items,
  compact = false,
}: {
  items: ActivityItem[];
  compact?: boolean;
}) {
  const { query } = useSearch();
  const { t } = useT();
  const filtered = useMemo(
    () =>
      items.filter((it) =>
        textMatches(query, it.message, it.kind, it.user ?? "")
      ),
    [items, query]
  );

  return (
    <div
      className={cn(
        "flex h-full flex-col aegis-panel-flat p-4",
        compact ? "min-h-0 rounded-none" : "min-h-[320px] rounded-2xl"
      )}
    >
      <div className="text-sm font-medium text-white">{t("dashboard.liveActivityFeed")}</div>
      <div className="mt-3 flex flex-1 flex-col gap-2.5 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-xs text-white/40">
            {query.trim() ? t("dashboard.noActivitySearch") : t("dashboard.noActivity")}
          </p>
        ) : null}
        {filtered.map((it) => {
          const Icon = iconFor(it.kind);
          return (
            <div
              key={it.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-white/6 bg-white/[0.03] px-3 py-3"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-xl border",
                    iconColor(it.kind)
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm leading-snug text-white/80">{it.message}</p>
                  {it.user ? (
                    <p className="mt-0.5 truncate text-xs text-white/45">
                      {it.user}
                    </p>
                  ) : null}
                </div>
              </div>
              <span className="shrink-0 pt-0.5 text-xs tabular-nums text-white/40">
                {formatTimeFromIso(it.time_iso)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
