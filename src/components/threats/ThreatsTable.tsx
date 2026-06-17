"use client";

import { useMemo, useState } from "react";
import type { Incident } from "@/lib/api";
import { cn } from "@/lib/utils/cn";
import { investigateTableClass } from "@/lib/utils/severityStyles";
import { severityBadgeClass } from "@/lib/utils/severityStyles";
import { useSearch } from "@/components/providers/SearchProvider";
import { useT } from "@/components/providers/LocaleProvider";
import { filterIncidents } from "@/lib/search";
import { titleToType } from "@/lib/utils/incidentMeta";
import {
  labelSeverity,
  labelStatus,
  labelVerdict,
} from "@/lib/i18n/translations";
import { MoreVertical } from "lucide-react";

const countryFlag: Record<string, string> = {
  Russia: "🇷🇺",
  Singapore: "🇸🇬",
  "Saudi Arabia": "🇸🇦",
  UAE: "🇦🇪",
  Germany: "🇩🇪",
};

const verdictStyle = (v: string) => {
  const t = v.toLowerCase();
  if (t === "malicious") return "text-red-300";
  if (t === "suspicious") return "text-amber-200";
  return "text-white/55";
};

const SEVERITIES = ["Critical", "High", "Medium", "Low"] as const;

export function ThreatsTable({
  rows,
  compact = false,
}: {
  rows: Incident[];
  compact?: boolean;
}) {
  const { query } = useSearch();
  const { t, locale, rtl } = useT();
  const [severity, setSeverity] = useState("All");

  const filtered = useMemo(() => {
    let list = filterIncidents(query, rows);
    if (severity !== "All") list = list.filter((r) => r.severity === severity);
    return list;
  }, [rows, severity, query]);

  return (
    <div
      className={cn(
        "flex flex-col aegis-panel p-4",
        compact ? "min-h-0 rounded-none" : "min-h-[380px] rounded-2xl"
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm font-medium text-white">{t("threatsPage.threatDetails")}</div>
        <div className="flex flex-wrap gap-2">
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white/70 outline-none"
          >
            <option value="All">{t("incidents.severity")}</option>
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {labelSeverity(locale, s)}
              </option>
            ))}
          </select>
          <select className="hidden rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white/70 outline-none sm:block">
            <option>{t("threatsPage.threatType")}</option>
          </select>
          <select className="hidden rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white/70 outline-none md:block">
            <option>{t("threatsPage.country")}</option>
          </select>
          <select className="hidden rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white/70 outline-none md:block">
            <option>{t("common.user")}</option>
          </select>
          <select className="hidden rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white/70 outline-none lg:block">
            <option>{t("threatsPage.timeRange")}</option>
          </select>
          <select className="hidden rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white/70 outline-none lg:block">
            <option>{t("threatsPage.aiConfidence")}</option>
          </select>
        </div>
      </div>

      <div className="mt-3 min-w-0 flex-1 aegis-table-scroll">
        <table className={cn("w-full min-w-[900px] text-sm", rtl ? "text-right" : "text-left")}>
          <thead>
            <tr className="border-b border-white/8 text-xs text-white/40">
              <th className="pb-3 pe-3 font-medium">{t("incidents.severity")}</th>
              <th className="pb-3 pe-3 font-medium">{t("threatsPage.threatType")}</th>
              <th className="pb-3 pe-3 font-medium">{t("common.user")}</th>
              <th className="pb-3 pe-3 font-medium">{t("dashboard.sourceIp")}</th>
              <th className="pb-3 pe-3 font-medium">{t("threatsPage.location")}</th>
              <th className="pb-3 pe-3 font-medium">{t("dashboard.aiVerdict")}</th>
              <th className="pb-3 pe-3 font-medium">{t("common.status")}</th>
              <th className="pb-3 pe-3 font-medium">{t("aiGov.time")}</th>
              <th className={cn("pb-3 font-medium", rtl ? "text-left" : "text-right")}>
                {t("common.action")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-t border-white/6 align-middle hover:bg-white/[0.03]"
              >
                <td className="py-3 pe-3">
                  <span
                    className={cn(
                      "inline-flex rounded-md border px-2 py-0.5 text-xs font-medium",
                      severityBadgeClass(r.severity)
                    )}
                  >
                    {labelSeverity(locale, r.severity)}
                  </span>
                </td>
                <td className="py-3 pe-3 font-medium text-white">
                  {titleToType[r.title] ?? r.title}
                </td>
                <td className="py-3 pe-3 text-white/70">{r.user}</td>
                <td className="py-3 pe-3 tabular-nums text-white/75">
                  {r.source_ip}
                </td>
                <td className="py-3 pe-3">
                  <span className="inline-flex items-center gap-1.5 text-white/70">
                    {countryFlag[r.country] ?? "🌐"} {r.country}
                  </span>
                </td>
                <td
                  className={cn(
                    "py-3 pe-3 text-xs font-medium",
                    verdictStyle(r.ai_verdict)
                  )}
                >
                  {labelVerdict(locale, r.ai_verdict)}
                </td>
                <td className="py-3 pe-3 text-xs text-amber-200/90">
                  {labelStatus(locale, "Open")}
                </td>
                <td className="py-3 pe-3 whitespace-nowrap text-white/50">
                  {r.minutes_ago} {t("common.minAgo")}
                </td>
                <td className="py-3">
                  <div className={cn("flex items-center gap-1", rtl ? "justify-start" : "justify-end")}>
                    <button type="button" className={investigateTableClass}>
                      {t("common.investigate")}
                    </button>
                    <button
                      type="button"
                      className="grid size-8 place-items-center rounded-lg text-white/40 hover:bg-white/5"
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
