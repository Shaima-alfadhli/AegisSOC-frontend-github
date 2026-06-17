"use client";

import type { AiGovernanceMetrics } from "@/lib/types/aiGovernance";
import { cn } from "@/lib/utils/cn";
import { Bot, EyeOff, ShieldAlert, ShieldCheck } from "lucide-react";
import { useT } from "@/components/providers/LocaleProvider";

export function AiGovernanceMetricCards({ m }: { m: AiGovernanceMetrics }) {
  const { t } = useT();
  const deltaUp = m.requests_delta_vs_yesterday > 0;

  const cards = [
    {
      titleKey: "metrics.aiRequestsToday",
      value: m.ai_requests_today.toLocaleString(),
      delta: `${deltaUp ? "+" : ""}${m.requests_delta_vs_yesterday} ${t("metrics.fromYesterday")}`,
      deltaUp,
      icon: Bot,
      iconClass: "text-cyan-300 bg-cyan-500/15 border-cyan-500/25",
    },
    {
      titleKey: "metrics.blockedAttempts",
      value: String(m.blocked_attempts),
      delta: t("metrics.dataLeakPolicy"),
      deltaUp: true,
      icon: ShieldAlert,
      iconClass: "text-red-300 bg-red-500/15 border-red-500/25",
    },
    {
      titleKey: "metrics.shadowAi",
      value: String(m.shadow_ai_detected),
      delta: t("metrics.shadowAiWeek"),
      deltaUp: true,
      icon: EyeOff,
      iconClass: "text-amber-300 bg-amber-500/15 border-amber-500/25",
    },
    {
      titleKey: "metrics.complianceRate",
      value: `${m.compliance_rate}%`,
      delta: `${m.flagged_for_review} ${t("metrics.flaggedReview")}`,
      deltaUp: false,
      icon: ShieldCheck,
      iconClass: "text-emerald-300 bg-emerald-500/15 border-emerald-500/25",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.titleKey}
            className="flex min-h-[120px] flex-col rounded-2xl aegis-panel-flat p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div
                className={`grid size-9 shrink-0 place-items-center rounded-xl border ${c.iconClass}`}
              >
                <Icon className="size-4" />
              </div>
            </div>
            <div className="mt-3 text-xs text-white/45">{t(c.titleKey)}</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-white">
              {c.value}
            </div>
            <div
              className={cn(
                "mt-1 text-xs",
                c.deltaUp ? "text-red-400" : "text-emerald-400"
              )}
            >
              {c.delta}
            </div>
          </div>
        );
      })}
    </div>
  );
}
