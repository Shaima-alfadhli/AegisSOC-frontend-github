"use client";

import { AiGovernanceDetailPanel } from "@/components/ai-governance/AiGovernanceDetailPanel";
import { useSearch } from "@/components/providers/SearchProvider";
import { useT } from "@/components/providers/LocaleProvider";
import type { AiGovernanceEvent } from "@/lib/types/aiGovernance";
import { filterAiEvents } from "@/lib/search";
import { cn } from "@/lib/utils/cn";
import { investigateTableClass } from "@/lib/utils/severityStyles";
import { severityBadgeClass } from "@/lib/utils/severityStyles";
import {
  labelAction,
  labelSeverity,
} from "@/lib/i18n/translations";
import { Filter, MoreVertical } from "lucide-react";
import { useMemo, useState } from "react";

const actionStyle = (a: string) => {
  if (a === "Blocked") return "bg-red-500/15 text-red-200 border-red-500/25";
  if (a === "Flagged")
    return "bg-amber-500/15 text-amber-100 border-amber-500/25";
  return "bg-emerald-500/15 text-emerald-100 border-emerald-500/25";
};

const SEVERITIES = ["Critical", "High", "Medium", "Low"] as const;
const ACTIONS = ["Allowed", "Blocked", "Flagged"] as const;

export function AiGovernanceWorkspace({ events }: { events: AiGovernanceEvent[] }) {
  const { t, locale, rtl } = useT();
  const [selectedId, setSelectedId] = useState(events[0]?.id ?? "");
  const [action, setAction] = useState("All");
  const [severity, setSeverity] = useState("All");
  const { query } = useSearch();
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = filterAiEvents(query, events);
    return list.filter((e) => {
      if (action !== "All" && e.action !== action) return false;
      if (severity !== "All" && e.severity !== severity) return false;
      return true;
    });
  }, [events, action, severity, query]);

  const selected =
    filtered.find((e) => e.id === selectedId) ?? filtered[0] ?? events[0];

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
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white/70 outline-none"
              >
                <option value="All">{t("aiGov.action")}</option>
                {ACTIONS.map((a) => (
                  <option key={a} value={a}>
                    {labelAction(locale, a)}
                  </option>
                ))}
              </select>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white/70 outline-none"
              >
                <option value="All">{t("aiGov.severity")}</option>
                {SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {labelSeverity(locale, s)}
                  </option>
                ))}
              </select>
              <select className="rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white/70 outline-none">
                <option>{t("aiGov.department")}</option>
              </select>
              <select className="rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white/70 outline-none">
                <option>{t("aiGov.tool")}</option>
              </select>
              <select className="rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white/70 outline-none">
                <option>{t("aiGov.last24h")}</option>
              </select>
            </div>
          </div>

          <div className="mt-3 min-w-0 flex-1 aegis-table-scroll">
            <table className={cn("w-full min-w-[960px] text-sm", rtl ? "text-right" : "text-left")}>
              <thead>
                <tr className="border-b border-white/8 text-xs text-white/40">
                  <th className="pb-3 pe-3 font-medium">{t("aiGov.action")}</th>
                  <th className="pb-3 pe-3 font-medium">{t("aiGov.user")}</th>
                  <th className="pb-3 pe-3 font-medium">{t("aiGov.department")}</th>
                  <th className="pb-3 pe-3 font-medium">{t("aiGov.tool")}</th>
                  <th className="pb-3 pe-3 font-medium">{t("aiGov.dataType")}</th>
                  <th className="pb-3 pe-3 font-medium">{t("aiGov.severity")}</th>
                  <th className="pb-3 pe-3 font-medium">{t("aiGov.risk")}</th>
                  <th className="pb-3 pe-3 font-medium">{t("aiGov.time")}</th>
                  <th className={cn("pb-3 font-medium", rtl ? "text-left" : "text-right")}>
                    {t("aiGov.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => {
                  const active = selected?.id === e.id;
                  return (
                    <tr
                      key={e.id}
                      onClick={() => setSelectedId(e.id)}
                      className={cn(
                        "cursor-pointer border-t border-white/6 align-middle transition",
                        active ? "bg-cyan-400/10" : "hover:bg-white/[0.03]"
                      )}
                    >
                      <td className="py-3 pe-3">
                        <span
                          className={cn(
                            "inline-flex rounded-md border px-2 py-0.5 text-xs font-medium",
                            actionStyle(e.action)
                          )}
                        >
                          {labelAction(locale, e.action)}
                        </span>
                      </td>
                      <td className="py-3 pe-3 font-medium text-white">{e.user}</td>
                      <td className="py-3 pe-3 text-white/60">{e.department}</td>
                      <td className="py-3 pe-3 text-white/70">{e.tool}</td>
                      <td className="py-3 pe-3 text-white/60">{e.data_category}</td>
                      <td className="py-3 pe-3">
                        <span
                          className={cn(
                            "inline-flex rounded-md border px-2 py-0.5 text-xs font-medium",
                            severityBadgeClass(e.severity)
                          )}
                        >
                          {labelSeverity(locale, e.severity)}
                        </span>
                      </td>
                      <td className="py-3 pe-3 tabular-nums font-semibold text-white">
                        {e.risk_score}
                      </td>
                      <td className="py-3 pe-3 whitespace-nowrap text-white/50">
                        {e.minutes_ago} {t("common.minAgo")}
                      </td>
                      <td className="py-3">
                        <div className={cn("flex items-center gap-1", rtl ? "justify-start" : "justify-end")}>
                          <button
                            type="button"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              setSelectedId(e.id);
                            }}
                            className={investigateTableClass}
                          >
                            {t("common.review")}
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
          <AiGovernanceDetailPanel event={selected} />
        </div>
      ) : null}
    </div>
  );
}
