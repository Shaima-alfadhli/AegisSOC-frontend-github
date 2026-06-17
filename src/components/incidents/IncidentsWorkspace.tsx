"use client";

import type { Incident } from "@/lib/api";
import { cn } from "@/lib/utils/cn";
import { investigateTableClass } from "@/lib/utils/severityStyles";
import { severityBadgeClass } from "@/lib/utils/severityStyles";
import { enrichIncident, titleToType } from "@/lib/utils/incidentMeta";
import { IncidentDetailPanel } from "@/components/incidents/IncidentDetailPanel";
import { useSearch } from "@/components/providers/SearchProvider";
import { useT } from "@/components/providers/LocaleProvider";
import { filterIncidents } from "@/lib/search";
import {
  labelSeverity,
  labelStatus,
} from "@/lib/i18n/translations";
import { Filter, MoreVertical } from "lucide-react";
import { useMemo, useState } from "react";

const countryFlag: Record<string, string> = {
  Russia: "🇷🇺",
  Singapore: "🇸🇬",
  "Saudi Arabia": "🇸🇦",
  UAE: "🇦🇪",
  Germany: "🇩🇪",
};

const statusStyle = (s: string) => {
  if (s === "Open") return "bg-red-500/15 text-red-200 border-red-500/25";
  if (s === "Investigating")
    return "bg-amber-500/15 text-amber-100 border-amber-500/25";
  if (s === "Under Review")
    return "bg-yellow-500/15 text-yellow-100 border-yellow-500/25";
  return "bg-emerald-500/15 text-emerald-100 border-emerald-500/25";
};

const SEVERITIES = ["Critical", "High", "Medium", "Low"] as const;
const STATUSES = ["Open", "Investigating", "Under Review", "Resolved"] as const;

export function IncidentsWorkspace({ incidents }: { incidents: Incident[] }) {
  const { t, locale, rtl } = useT();
  const enriched = useMemo(
    () => incidents.map((i) => enrichIncident(i)),
    [incidents]
  );

  const [selectedId, setSelectedId] = useState(enriched[0]?.id ?? "");
  const [severity, setSeverity] = useState("All");
  const [status, setStatus] = useState("All");
  const { query } = useSearch();
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = filterIncidents(query, enriched);
    return list.filter((i) => {
      if (severity !== "All" && i.severity !== severity) return false;
      if (status !== "All" && i.status !== status) return false;
      return true;
    });
  }, [enriched, severity, status, query]);

  const selected =
    filtered.find((i) => i.id === selectedId) ?? filtered[0] ?? enriched[0];

  const pageCount = Math.max(1, filtered.length);
  const showing = filtered.length;

  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-stretch">
      <div className="min-w-0 flex-1">
        <div className="flex min-h-0 flex-col rounded-2xl aegis-panel-flat p-4 md:min-h-[420px] xl:min-h-[520px]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              {query.trim() ? (
                <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100">
                  {t("common.filterPrefix")}: {query}
                </span>
              ) : null}
              <button
                type="button"
                className="grid size-9 place-items-center rounded-xl border border-white/10 bg-black/20 text-white/50"
                aria-label={t("common.filters")}
              >
                <Filter className="size-4" />
              </button>
            </div>
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
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white/70 outline-none"
              >
                <option value="All">{t("common.status")}</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {labelStatus(locale, s)}
                  </option>
                ))}
              </select>
              <select className="rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white/70 outline-none">
                <option>{t("incidents.incidentType")}</option>
              </select>
              <select className="rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white/70 outline-none">
                <option>{t("incidents.owner")}</option>
              </select>
              <select className="rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white/70 outline-none">
                <option>{t("incidents.last7Days")}</option>
              </select>
            </div>
          </div>

          <div className="mt-3 min-w-0 flex-1 aegis-table-scroll">
            <table className={cn("w-full min-w-[960px] text-sm", rtl ? "text-right" : "text-left")}>
              <thead>
                <tr className="border-b border-white/8 text-xs text-white/40">
                  <th className="pb-3 pe-3 font-medium">{t("incidents.severity")}</th>
                  <th className="pb-3 pe-3 font-medium">{t("incidents.title")}</th>
                  <th className="pb-3 pe-3 font-medium">{t("incidents.type")}</th>
                  <th className="pb-3 pe-3 font-medium">{t("common.user")}</th>
                  <th className="pb-3 pe-3 font-medium">{t("incidents.source")}</th>
                  <th className="pb-3 pe-3 font-medium">{t("common.status")}</th>
                  <th className="pb-3 pe-3 font-medium">{t("incidents.owner")}</th>
                  <th className="pb-3 pe-3 font-medium">{t("aiGov.time")}</th>
                  <th className={cn("pb-3 font-medium", rtl ? "text-left" : "text-right")}>
                    {t("aiGov.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => {
                  const active = selected?.id === i.id;
                  return (
                    <tr
                      key={i.id}
                      onClick={() => setSelectedId(i.id)}
                      className={cn(
                        "cursor-pointer border-t border-white/6 align-middle transition",
                        active
                          ? "bg-cyan-400/10"
                          : "hover:bg-white/[0.03]"
                      )}
                    >
                      <td className="py-3 pe-3">
                        <span
                          className={cn(
                            "inline-flex rounded-md border px-2 py-0.5 text-xs font-medium",
                            severityBadgeClass(i.severity)
                          )}
                        >
                          {labelSeverity(locale, i.severity)}
                        </span>
                      </td>
                      <td className="py-3 pe-3 font-medium text-white">
                        {i.title}
                      </td>
                      <td className="py-3 pe-3 text-white/60">
                        {i.incident_type ?? titleToType[i.title]}
                      </td>
                      <td className="py-3 pe-3 text-white/70">{i.user}</td>
                      <td className="py-3 pe-3">
                        <span className="inline-flex flex-col gap-0.5 text-xs">
                          <span className="tabular-nums text-white/75">
                            {i.source_ip}
                          </span>
                          <span className="text-white/45">
                            {countryFlag[i.country] ?? "🌐"} {i.country}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 pe-3">
                        <span
                          className={cn(
                            "inline-flex rounded-md border px-2 py-0.5 text-xs",
                            statusStyle(i.status ?? "Open")
                          )}
                        >
                          {labelStatus(locale, i.status ?? "Open")}
                        </span>
                      </td>
                      <td className="py-3 pe-3 text-white/60">{i.owner}</td>
                      <td className="py-3 pe-3 whitespace-nowrap text-white/50">
                        {i.minutes_ago} {t("common.minAgo")}
                      </td>
                      <td className="py-3">
                        <div className={cn("flex items-center gap-1", rtl ? "justify-start" : "justify-end")}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(i.id);
                            }}
                            className={investigateTableClass}
                          >
                            {t("common.investigate")}
                          </button>
                          <button
                            type="button"
                            className="grid size-8 place-items-center rounded-lg text-white/40 hover:bg-white/5"
                            aria-label={t("aiGov.actions")}
                          >
                            <MoreVertical className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-white/8 pt-3 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <span>
              1 {t("common.to")} {showing} {t("common.of")} {filtered.length} {t("common.results")}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-white/10 px-2 py-1 disabled:opacity-40"
              >
                {t("common.prev")}
              </button>
              <span>
                {t("common.page")} {page} {t("common.of")} {pageCount}
              </span>
              <button
                type="button"
                disabled={page >= pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                className="rounded-lg border border-white/10 px-2 py-1 disabled:opacity-40"
              >
                {t("common.next")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {selected ? (
        <div className="w-full shrink-0 xl:w-[380px]">
          <IncidentDetailPanel incident={selected} />
        </div>
      ) : null}
    </div>
  );
}
