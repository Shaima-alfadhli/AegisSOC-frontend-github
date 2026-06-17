"use client";

import type { AiGovernanceEvent } from "@/lib/types/aiGovernance";
import { cn } from "@/lib/utils/cn";
import { severityBadgeClass } from "@/lib/utils/severityStyles";
import {
  investigatePanelClass,
  panelActionGridClass,
} from "@/lib/utils/severityStyles";
import { useT } from "@/components/providers/LocaleProvider";
import {
  labelAction,
  labelSeverity,
  labelStatus,
} from "@/lib/i18n/translations";
import { Ban, FileSearch, ShieldCheck } from "lucide-react";
import { useState } from "react";

const TAB_KEYS = ["details", "policy", "dlp", "actions"] as const;
type TabKey = (typeof TAB_KEYS)[number];

const actionStyle = (a: string) => {
  if (a === "Blocked") return "bg-red-500/15 text-red-200 border-red-500/25";
  if (a === "Flagged")
    return "bg-amber-500/15 text-amber-100 border-amber-500/25";
  return "bg-emerald-500/15 text-emerald-100 border-emerald-500/25";
};

const statusStyle = (s: string) => {
  if (s === "Open") return "bg-red-500/15 text-red-200 border-red-500/25";
  if (s === "Under Review")
    return "bg-amber-500/15 text-amber-100 border-amber-500/25";
  return "bg-emerald-500/15 text-emerald-100 border-emerald-500/25";
};

export function AiGovernanceDetailPanel({ event }: { event: AiGovernanceEvent }) {
  const { t, locale } = useT();
  const [tab, setTab] = useState<TabKey>("details");

  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-2xl aegis-panel p-4 md:min-h-[420px] lg:max-w-[380px] xl:min-h-[520px]">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-snug text-white">
          {event.data_category} — {event.tool}
        </h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <span
            className={cn(
              "inline-flex rounded-md border px-2 py-0.5 text-xs font-medium",
              actionStyle(event.action)
            )}
          >
            {labelAction(locale, event.action)}
          </span>
          <span
            className={cn(
              "inline-flex rounded-md border px-2 py-0.5 text-xs font-medium",
              severityBadgeClass(event.severity)
            )}
          >
            {labelSeverity(locale, event.severity)}
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
            {t(`aiGov.${key}`)}
          </button>
        ))}
      </div>

      <div className="mt-4 flex-1 space-y-4 overflow-y-auto text-sm">
        {tab === "details" && (
          <>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <dt className="text-white/40">{t("aiGov.eventId")}</dt>
              <dd className="font-medium text-white">{event.id}</dd>
              <dt className="text-white/40">{t("aiGov.user")}</dt>
              <dd className="text-white/80">{event.user}</dd>
              <dt className="text-white/40">{t("aiGov.department")}</dt>
              <dd className="text-white/80">{event.department}</dd>
              <dt className="text-white/40">{t("aiGov.tool")}</dt>
              <dd className="text-white/80">{event.tool}</dd>
              <dt className="text-white/40">{t("common.riskScore")}</dt>
              <dd className="font-semibold text-red-300">{event.risk_score}/100</dd>
              <dt className="text-white/40">{t("common.status")}</dt>
              <dd>
                <span
                  className={cn(
                    "inline-flex rounded-md border px-2 py-0.5 text-xs",
                    statusStyle(event.status)
                  )}
                >
                  {labelStatus(locale, event.status)}
                </span>
              </dd>
              <dt className="text-white/40">{t("aiGov.time")}</dt>
              <dd className="text-white/60">
                {event.minutes_ago} {t("common.minAgo")}
              </dd>
            </dl>
            <div>
              <div className="text-xs text-white/40">{t("aiGov.promptPreview")}</div>
              <p className="mt-1 rounded-xl border border-white/8 bg-black/20 p-3 text-xs leading-relaxed text-white/70">
                {event.prompt_preview}
              </p>
            </div>
          </>
        )}

        {tab === "policy" && (
          <dl className="space-y-3 text-xs">
            <div>
              <dt className="text-white/40">Policy ID</dt>
              <dd className="mt-0.5 font-medium text-white">{event.policy_id}</dd>
            </div>
            <div>
              <dt className="text-white/40">Policy Name</dt>
              <dd className="mt-0.5 text-white/80">{event.policy_name}</dd>
            </div>
            <div>
              <dt className="text-white/40">{t("aiGov.dataType")}</dt>
              <dd className="mt-0.5 text-white/80">{event.data_category}</dd>
            </div>
            <div>
              <dt className="text-white/40">{t("aiGov.decision")}</dt>
              <dd className="mt-1">
                <span
                  className={cn(
                    "inline-flex rounded-md border px-2 py-0.5 text-xs",
                    actionStyle(event.action)
                  )}
                >
                  {labelAction(locale, event.action)} {t("aiGov.byPolicyEngine")}
                </span>
              </dd>
            </div>
          </dl>
        )}

        {tab === "dlp" && (
          <div className="space-y-3 text-xs">
            {event.dlp_rule ? (
              <>
                <div>
                  <div className="text-white/40">{t("aiGov.triggeredRule")}</div>
                  <div className="mt-1 font-medium text-red-300">{event.dlp_rule}</div>
                </div>
                <div>
                  <div className="text-white/40">{t("aiGov.patternMatched")}</div>
                  <div className="mt-1 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 font-mono text-red-200">
                    {event.data_category === "Financial" && "SA IBAN pattern"}
                    {event.data_category === "PII" && "Saudi National ID (10 digits)"}
                    {event.data_category === "PCI" && "Credit card PAN"}
                    {event.data_category === "Credentials" && "API key / secret"}
                    {event.data_category === "Shadow AI" && "Unapproved tool domain"}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-white/50">{t("aiGov.noDlp")}</p>
            )}
          </div>
        )}

        {tab === "actions" && (
          <div className="space-y-3">
            <p className="text-xs text-white/50">{t("common.recommendedActions")}</p>
            <ul className="space-y-2 text-xs text-white/70">
              {event.action === "Blocked" && (
                <>
                  <li>• Notify user with policy violation message</li>
                  <li>• Alert SOC and department manager</li>
                  <li>• Log event for compliance audit trail</li>
                  {event.severity === "Critical" && (
                    <li>• Consider temporary AI access suspension</li>
                  )}
                </>
              )}
              {event.action === "Flagged" && (
                <>
                  <li>• Queue for SOC analyst review</li>
                  <li>• Notify Compliance if PII detected</li>
                </>
              )}
              {event.action === "Allowed" && (
                <li>• Logged for audit — no action required</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className={panelActionGridClass}>
        <button type="button" className={investigatePanelClass}>
          <FileSearch className="size-3.5" />
          {t("common.review")}
        </button>
        <button type="button" className={investigatePanelClass}>
          <Ban className="size-3.5" />
          {t("aiGov.suspendAi")}
        </button>
        <button type="button" className={investigatePanelClass}>
          <ShieldCheck className="size-3.5" />
          {t("aiGov.resolve")}
        </button>
      </div>
    </div>
  );
}
