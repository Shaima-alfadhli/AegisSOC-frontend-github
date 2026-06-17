"use client";

import { useMemo } from "react";
import type { Incident } from "@/lib/api";
import { useSearch } from "@/components/providers/SearchProvider";
import { useT } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils/cn";
import { investigateTableClass } from "@/lib/utils/severityStyles";
import { filterIncidents } from "@/lib/search";
import { severityBadgeClass } from "@/lib/utils/severityStyles";
import { labelSeverity, labelVerdict } from "@/lib/i18n/translations";
import { MoreVertical } from "lucide-react";
import Link from "next/link";

const countryFlag: Record<string, string> = {
  Russia: "🇷🇺",
  Singapore: "🇸🇬",
  "Saudi Arabia": "🇸🇦",
  UAE: "🇦🇪",
  Germany: "🇩🇪",
};

const verdictPill = (v: string) => {
  const t = v.toLowerCase();
  if (t === "malicious") return "text-red-300";
  if (t === "suspicious") return "text-amber-200";
  return "text-white/60";
};

export function IncidentsTable({
  incidents,
  compact = false,
}: {
  incidents: Incident[];
  compact?: boolean;
}) {
  const { query } = useSearch();
  const { t, locale, rtl } = useT();
  const filtered = useMemo(
    () => filterIncidents(query, incidents),
    [incidents, query]
  );

  return (
    <div
      className={cn(
        "flex h-full flex-col aegis-panel-flat p-4",
        compact ? "min-h-0 rounded-none" : "min-h-[320px] rounded-2xl"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-medium text-white">
          {t("dashboard.criticalIncidents")}
          {query.trim() ? (
            <span className="ms-2 text-xs font-normal text-cyan-200/80">
              ({filtered.length})
            </span>
          ) : null}
        </div>
        <Link
          href="/incidents"
          className="text-xs text-cyan-300/90 hover:text-cyan-200"
        >
          {t("dashboard.viewAllIncidents")}
        </Link>
      </div>

      <div className="mt-3 min-w-0 flex-1 aegis-table-scroll">
        <table className={cn("w-full min-w-[520px] text-sm md:min-w-[720px]", rtl ? "text-right" : "text-left")}>
          <thead>
            <tr className="border-b border-white/8 text-xs text-white/45">
              <th className="pb-3 pe-3 font-medium">{t("incidents.severity")}</th>
              <th className="pb-3 pe-3 font-medium">{t("dashboard.incident")}</th>
              <th className="pb-3 pe-3 font-medium">{t("common.user")}</th>
              <th className="hidden pb-3 pe-3 font-medium md:table-cell">{t("dashboard.sourceIp")}</th>
              <th className="hidden pb-3 pe-3 font-medium lg:table-cell">{t("aiGov.time")}</th>
              <th className="pb-3 pe-3 font-medium">{t("dashboard.aiVerdict")}</th>
              <th className={cn("pb-3 font-medium", rtl ? "text-left" : "text-right")}>
                {t("common.action")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => (
              <tr
                key={i.id}
                className="border-t border-white/6 align-middle hover:bg-white/[0.03]"
              >
                <td className="py-3.5 pe-3">
                  <span
                    className={cn(
                      "inline-flex rounded-md border px-2 py-0.5 text-xs font-medium",
                      severityBadgeClass(i.severity)
                    )}
                  >
                    {labelSeverity(locale, i.severity)}
                  </span>
                </td>
                <td className="py-3.5 pe-3 font-medium text-white">
                  {i.title}
                </td>
                <td className="py-3.5 pe-3 text-white/70">{i.user}</td>
                <td className="hidden py-3.5 pe-3 md:table-cell">
                  <span className="inline-flex items-center gap-2 text-white/75">
                    <span className="text-base leading-none">
                      {countryFlag[i.country] ?? "🌐"}
                    </span>
                    <span className="tabular-nums">{i.source_ip}</span>
                  </span>
                </td>
                <td className="hidden py-3.5 pe-3 whitespace-nowrap text-white/55 lg:table-cell">
                  {i.minutes_ago} {t("common.minAgo")}
                </td>
                <td className={cn("py-3.5 pe-3 text-xs font-medium", verdictPill(i.ai_verdict))}>
                  {labelVerdict(locale, i.ai_verdict)}
                </td>
                <td className="py-3.5">
                  <div className={cn("flex items-center gap-1", rtl ? "justify-start" : "justify-end")}>
                    <button type="button" className={investigateTableClass}>
                      {t("common.investigate")}
                    </button>
                    <button
                      type="button"
                      className="grid size-8 place-items-center rounded-lg text-white/40 hover:bg-white/5 hover:text-white/70"
                      aria-label={t("common.more")}
                    >
                      <MoreVertical className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
