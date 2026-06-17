"use client";

import type { Incident } from "@/lib/api";
import { cn } from "@/lib/utils/cn";
import { severityBadgeClass } from "@/lib/utils/severityStyles";
import { enrichIncident } from "@/lib/utils/incidentMeta";
import {
  freezePanelClass,
  investigatePanelClass,
  panelActionGridClass,
} from "@/lib/utils/severityStyles";
import { useT } from "@/components/providers/LocaleProvider";
import {
  labelSeverity,
  labelStatus,
  labelVerdict,
} from "@/lib/i18n/translations";
import { LockKeyhole, MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";

const TAB_KEYS = ["details", "timeline", "aiAnalysis", "response"] as const;
type TabKey = (typeof TAB_KEYS)[number];

const statusStyle = (s: string) => {
  if (s === "Open") return "bg-red-500/15 text-red-200 border-red-500/25";
  if (s === "Investigating")
    return "bg-amber-500/15 text-amber-100 border-amber-500/25";
  if (s === "Under Review")
    return "bg-yellow-500/15 text-yellow-100 border-yellow-500/25";
  return "bg-emerald-500/15 text-emerald-100 border-emerald-500/25";
};

export function IncidentDetailPanel({ incident }: { incident: Incident }) {
  const { t, locale } = useT();
  const [tab, setTab] = useState<TabKey>("details");
  const inc = enrichIncident(incident);

  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-2xl aegis-panel p-4 md:min-h-[420px] lg:max-w-[380px] xl:min-h-[520px]">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold leading-snug text-white">
            {inc.title}
          </h2>
          <span
            className={cn(
              "mt-2 inline-flex rounded-md border px-2 py-0.5 text-xs font-medium",
              severityBadgeClass(inc.severity)
            )}
          >
            {labelSeverity(locale, inc.severity)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex gap-1 border-b border-white/8 pb-2">
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-medium transition",
              tab === key
                ? "bg-cyan-400/15 text-cyan-100"
                : "text-white/45 hover:text-white/70"
            )}
          >
            {t(`incidentPanel.${key}`)}
          </button>
        ))}
      </div>

      <div className="mt-4 flex-1 space-y-4 overflow-y-auto text-sm">
        {tab === "details" && (
          <>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <dt className="text-white/40">{t("incidentPanel.incidentId")}</dt>
              <dd className="font-medium text-white">{inc.display_id}</dd>
              <dt className="text-white/40">{t("common.status")}</dt>
              <dd>
                <span
                  className={cn(
                    "inline-flex rounded-md border px-2 py-0.5 text-xs",
                    statusStyle(inc.status ?? "Open")
                  )}
                >
                  {labelStatus(locale, inc.status ?? "Open")}
                </span>
              </dd>
              <dt className="text-white/40">{t("incidents.owner")}</dt>
              <dd className="text-white/80">{inc.owner}</dd>
              <dt className="text-white/40">{t("aiGov.time")}</dt>
              <dd className="text-white/80">
                {inc.minutes_ago} {t("common.minAgo")}
              </dd>
            </dl>

            <div>
              <div className="text-xs font-medium text-white/45">{t("incidentPanel.description")}</div>
              <p className="mt-1.5 text-xs leading-relaxed text-white/70">
                {inc.description}
              </p>
            </div>

            <div>
              <div className="text-xs font-medium text-white/45">
                {t("incidentPanel.sourceInfo")}
              </div>
              <dl className="mt-2 space-y-1.5 text-xs">
                <div className="flex justify-between gap-2">
                  <span className="text-white/40">{t("incidentPanel.ip")}</span>
                  <span className="tabular-nums text-white/80">{inc.source_ip}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-white/40">{t("usersPage.location")}</span>
                  <span className="text-white/80">
                    {inc.country}, {inc.city}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-white/40">{t("incidentPanel.isp")}</span>
                  <span className="text-white/80">{inc.isp}</span>
                </div>
              </dl>
            </div>

            <div>
              <div className="text-xs font-medium text-white/45">{t("incidentPanel.affectedUser")}</div>
              <dl className="mt-2 space-y-1.5 text-xs">
                <div className="flex justify-between gap-2">
                  <span className="text-white/40">{t("common.user")}</span>
                  <span className="text-white/80">{inc.user}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-white/40">{t("usersPage.department")}</span>
                  <span className="text-white/80">{inc.department}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-white/40">{t("usersPage.role")}</span>
                  <span className="text-white/80">{inc.role}</span>
                </div>
              </dl>
            </div>
          </>
        )}

        {tab === "timeline" && (
          <ul className="space-y-3 text-xs text-white/70">
            <li className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2">
              {t("incidentPanel.alertTriggered")} — {inc.minutes_ago} {t("common.minAgo")}
            </li>
            <li className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2">
              {t("incidentPanel.assignedTo")} {inc.owner}
            </li>
            <li className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2">
              {t("incidentPanel.aiVerdictLabel")}: {labelVerdict(locale, inc.ai_verdict)}
            </li>
          </ul>
        )}

        {tab === "aiAnalysis" && (
          <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3 text-xs leading-relaxed text-white/75">
            <p className="font-medium text-cyan-100">{t("incidentPanel.riskAssessment")}</p>
            <p className="mt-2">
              {inc.ai_verdict === "Malicious"
                ? t("incidentPanel.maliciousHint")
                : t("incidentPanel.suspiciousHint")}
            </p>
            <p className="mt-2 text-white/50">
              {t("incidentPanel.verdict")}: {labelVerdict(locale, inc.ai_verdict)} · {t("incidents.type")}: {inc.incident_type}
            </p>
          </div>
        )}

        {tab === "response" && (
          <ul className="list-inside list-disc space-y-1 text-xs text-white/70">
            <li>{t("incidentPanel.responseVerify")}</li>
            <li>{t("incidentPanel.responseReviewLogs")}</li>
            <li>{t("incidentPanel.responseRevoke")}</li>
          </ul>
        )}
      </div>

      <div className={`${panelActionGridClass} border-t border-white/8 pt-4`}>
        <button type="button" className={investigatePanelClass}>
          <Search className="size-3.5 shrink-0" />
          {t("common.investigate")}
        </button>
        <button type="button" className={freezePanelClass}>
          <LockKeyhole className="size-3.5 shrink-0" />
          {t("incidentPanel.freezeUser")}
        </button>
        <button
          type="button"
          className="col-span-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-medium text-white/60 hover:bg-white/8"
        >
          <MoreHorizontal className="size-3.5 shrink-0" />
          {t("incidentPanel.moreActions")}
        </button>
      </div>
    </div>
  );
}
