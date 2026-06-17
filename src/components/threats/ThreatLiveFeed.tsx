"use client";

import type { ActivityItem } from "@/lib/api";
import { useSearch } from "@/components/providers/SearchProvider";
import { useT } from "@/components/providers/LocaleProvider";
import { filterActivity, textMatches } from "@/lib/search";
import { translations } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils/cn";
import { formatTimeFromIso } from "@/lib/utils/formatTime";
import { Ban, Radio, ShieldAlert, Zap } from "lucide-react";

function iconFor(kind: string) {
  const k = kind.toLowerCase();
  if (k.includes("blocked") || k.includes("malware")) return Ban;
  if (k.includes("risk")) return Zap;
  return ShieldAlert;
}

function iconColor(kind: string) {
  const k = kind.toLowerCase();
  if (k.includes("blocked") || k.includes("malware"))
    return "border-red-500/25 bg-red-500/15 text-red-200";
  if (k.includes("risk"))
    return "border-amber-400/25 bg-amber-400/15 text-amber-100";
  return "border-cyan-400/25 bg-cyan-400/15 text-cyan-100";
}

export function ThreatLiveFeed({
  items,
  compact = false,
}: {
  items: ActivityItem[];
  compact?: boolean;
}) {
  const { t } = useT();
  const { query } = useSearch();

  const feedExtras: ActivityItem[] = [
    {
      id: "tf_1",
      kind: "blocked",
      message: t("threatsPage.feedBruteForce"),
      time_iso: "2026-05-27T08:23:00.000Z",
    },
    {
      id: "tf_2",
      kind: "malware_blocked",
      message: t("threatsPage.feedMalware"),
      time_iso: "2026-05-27T08:18:00.000Z",
    },
  ];

  const allRaw = [...feedExtras, ...items];
  const all = query.trim()
    ? allRaw.filter((it) => {
        if (it.id === "tf_1") {
          return textMatches(
            query,
            it.message,
            translations.en.threatsPage.feedBruteForce,
            translations.ar.threatsPage.feedBruteForce
          );
        }
        if (it.id === "tf_2") {
          return textMatches(
            query,
            it.message,
            translations.en.threatsPage.feedMalware,
            translations.ar.threatsPage.feedMalware
          );
        }
        return filterActivity(query, [it]).length > 0;
      })
    : allRaw;
  const allSliced = all.slice(0, 6);

  return (
    <div
      className={cn(
        "flex flex-col aegis-panel p-4",
        compact ? "min-h-0 rounded-none" : "min-h-[380px] rounded-2xl"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="size-4 text-red-400" />
          <span className="text-sm font-medium text-white">{t("threatsPage.liveThreatFeed")}</span>
          <span className="rounded-full border border-red-500/30 bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-300">
            {t("threatsPage.live")}
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-2 overflow-y-auto">
        {allSliced.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-white/45">
            {query.trim() ? t("common.noResultsFor") : t("dashboard.noActivity")}{" "}
            {query.trim() ? `"${query}"` : ""}
          </p>
        ) : (
        allSliced.map((it) => {
          const Icon = iconFor(it.kind);
          return (
            <div
              key={it.id}
              className="flex items-start justify-between gap-2 rounded-xl border border-white/6 bg-white/[0.03] px-3 py-2.5"
            >
              <div className="flex min-w-0 items-start gap-2">
                <div
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-lg border",
                    iconColor(it.kind)
                  )}
                >
                  <Icon className="size-3.5" />
                </div>
                <p className="text-xs leading-snug text-white/75">{it.message}</p>
              </div>
              <span className="shrink-0 text-[10px] tabular-nums text-white/40">
                {formatTimeFromIso(it.time_iso)}
              </span>
            </div>
          );
        })
        )}
      </div>

      <button
        type="button"
        className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-medium text-white/60 hover:bg-white/8"
      >
        {t("threatsPage.viewAllFeed")}
      </button>
    </div>
  );
}
