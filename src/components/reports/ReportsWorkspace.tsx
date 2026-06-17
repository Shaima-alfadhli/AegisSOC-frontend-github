"use client";

import { cn } from "@/lib/utils/cn";
import {
  Calendar,
  Download,
  FileBarChart,
  MoreVertical,
  Play,
  Plus,
} from "lucide-react";
import { useSearch } from "@/components/providers/SearchProvider";
import { useT } from "@/components/providers/LocaleProvider";
import { filterReports } from "@/lib/search";
import { useMemo, useState } from "react";

const TAB_KEYS = ["allReports", "scheduled", "compliance", "executive", "custom"] as const;
type TabKey = (typeof TAB_KEYS)[number];

type ReportRow = {
  id: string;
  nameKey: string;
  typeKey: string;
  schedule: string;
  lastGenerated: string;
  nextRun: string;
  format: string;
  status: "Success" | "Failed";
};

const reports: ReportRow[] = [];

export function ReportsWorkspace() {
  const { t, rtl } = useT();
  const { query } = useSearch();
  const [tab, setTab] = useState<TabKey>("allReports");
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("Operational");

  const stats = [
    { key: "reportsPage.totalReports", value: "0" },
    { key: "reportsPage.scheduledReports", value: "0" },
    { key: "reportsPage.generatedToday", value: "0" },
    { key: "reportsPage.failedReports", value: "0" },
  ];

  const displayReports = useMemo(
    () =>
      reports.map((r) => ({
        ...r,
        name: t(r.nameKey),
        type: t(r.typeKey),
      })),
    [t]
  );

  const filtered = useMemo(() => {
    let list = filterReports(query, displayReports);
    if (tab !== "allReports") {
      list = list.filter((r) => {
        const orig = reports.find((x) => x.id === r.id)!;
        if (tab === "scheduled") return orig.schedule !== "On demand";
        if (tab === "compliance") return orig.typeKey === "reportsPage.compliance";
        if (tab === "executive") return orig.typeKey === "reportsPage.executive";
        return orig.typeKey === "reportsPage.custom" || orig.schedule === "On demand";
      });
    }
    return list;
  }, [query, tab, displayReports]);

  const reportTypes = [
    { value: "Operational", key: "reportsPage.operational" },
    { value: "Compliance", key: "reportsPage.compliance" },
    { value: "Executive", key: "reportsPage.executive" },
    { value: "Incident", key: "reportsPage.incident" },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.key}
            className="rounded-2xl aegis-panel-flat px-4 py-3"
          >
            <div className="text-xs text-white/45">{t(s.key)}</div>
            <div className="mt-1 text-2xl font-semibold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-stretch">
        <div className="min-w-0 flex-1">
          <div className="rounded-2xl aegis-panel-flat p-4">
            <div className="flex flex-wrap gap-1 border-b border-white/8 pb-3">
              {TAB_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                    tab === key
                      ? "bg-cyan-400/15 text-cyan-100"
                      : "text-white/45 hover:text-white/70"
                  )}
                >
                  {t(`reportsPage.${key}`)}
                </button>
              ))}
            </div>

            <div className="mt-3 aegis-table-scroll">
              <table className={cn("w-full min-w-[900px] text-sm", rtl ? "text-right" : "text-left")}>
                <thead>
                  <tr className="border-b border-white/8 text-xs text-white/40">
                    <th className="pb-3 pe-3 font-medium">{t("reportsPage.reportName")}</th>
                    <th className="pb-3 pe-3 font-medium">{t("reportsPage.type")}</th>
                    <th className="pb-3 pe-3 font-medium">{t("reportsPage.schedule")}</th>
                    <th className="pb-3 pe-3 font-medium">{t("reportsPage.lastGenerated")}</th>
                    <th className="pb-3 pe-3 font-medium">{t("reportsPage.nextRun")}</th>
                    <th className="pb-3 pe-3 font-medium">{t("reportsPage.format")}</th>
                    <th className="pb-3 pe-3 font-medium">{t("common.status")}</th>
                    <th className={cn("pb-3 font-medium", rtl ? "text-left" : "text-right")}>
                      {t("aiGov.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-sm text-white/45">
                        {t("common.noData")}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r) => {
                      const orig = reports.find((x) => x.id === r.id)!;
                      return (
                      <tr
                        key={r.id}
                        className="border-t border-white/6 align-middle hover:bg-white/[0.03]"
                      >
                        <td className="py-3 pe-3 font-medium text-white">
                          {t(orig.nameKey)}
                        </td>
                        <td className="py-3 pe-3 text-white/60">{t(orig.typeKey)}</td>
                        <td className="py-3 pe-3 text-white/55">{r.schedule}</td>
                        <td className="py-3 pe-3 text-white/55">{r.lastGenerated}</td>
                        <td className="py-3 pe-3 text-white/55">{r.nextRun}</td>
                        <td className="py-3 pe-3">
                          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/60">
                            {r.format}
                          </span>
                        </td>
                        <td className="py-3 pe-3">
                          <span
                            className={cn(
                              "text-xs font-medium",
                              r.status === "Success"
                                ? "text-emerald-400"
                                : "text-red-300"
                            )}
                          >
                            {r.status === "Success"
                              ? t("reportsPage.success")
                              : t("reportsPage.failed")}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className={cn("flex items-center gap-1", rtl ? "justify-start" : "justify-end")}>
                            <button
                              type="button"
                              className="grid size-8 place-items-center rounded-lg border border-white/10 text-white/50 hover:bg-white/5"
                              aria-label={t("common.download")}
                            >
                              <Download className="size-3.5" />
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
                    );
                  })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-4 xl:w-[320px]">
          <div className="rounded-2xl aegis-panel p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Plus className="size-4 text-cyan-300" />
              {t("reportsPage.createNewReport")}
            </div>
            <div className="mt-4 space-y-3">
              <label className="block text-xs text-white/45">
                {t("reportsPage.reportName")}
                <input
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder={t("reportsPage.reportNamePlaceholder")}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35"
                />
              </label>
              <label className="block text-xs text-white/45">
                {t("reportsPage.reportType")}
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80 outline-none"
                >
                  {reportTypes.map((rt) => (
                    <option key={rt.value} value={rt.value}>
                      {t(rt.key)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-white/45">
                {t("reportsPage.schedule")}
                <select className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80 outline-none">
                  <option>{t("reportsPage.daily")}</option>
                  <option>{t("reportsPage.weekly")}</option>
                  <option>{t("reportsPage.monthly")}</option>
                  <option>{t("reportsPage.onDemand")}</option>
                </select>
              </label>
              <label className="block text-xs text-white/45">
                {t("reportsPage.format")}
                <select className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80 outline-none">
                  <option>PDF</option>
                  <option>CSV</option>
                </select>
              </label>
              <label className="block text-xs text-white/45">
                {t("reportsPage.recipients")}
                <input
                  placeholder={t("reportsPage.recipientsPlaceholder")}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35"
                />
              </label>
              <button
                type="button"
                className="w-full rounded-xl border border-cyan-400/30 bg-cyan-400/15 py-2.5 text-sm font-medium text-cyan-100 hover:bg-cyan-400/20"
              >
                {t("reportsPage.createReport")}
              </button>
            </div>
          </div>

          <div className="rounded-2xl aegis-panel-flat p-4">
            <div className="text-xs font-medium text-white/45">{t("reportsPage.quickActions")}</div>
            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-medium text-white/70 hover:bg-white/8"
              >
                <Play className="size-3.5 text-cyan-300" />
                {t("reportsPage.generateNow")}
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-medium text-white/70 hover:bg-white/8"
              >
                <FileBarChart className="size-3.5 text-cyan-300" />
                {t("reportsPage.viewTemplates")}
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-medium text-white/70 hover:bg-white/8"
              >
                <Calendar className="size-3.5 text-cyan-300" />
                {t("reportsPage.manageSchedule")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
