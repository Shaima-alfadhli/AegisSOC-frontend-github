"use client";

import type { DashboardMetrics } from "@/lib/api";
import { ShieldAlert, Ban, Brain } from "lucide-react";
import { useT } from "@/components/providers/LocaleProvider";

export function ThreatSummaryCards({
  m,
  peakAlerts,
}: {
  m: DashboardMetrics;
  peakAlerts: number;
}) {
  const { t } = useT();

  const cards = [
    {
      titleKey: "threats.criticalThreats",
      value: String(m.active_threats.Critical ?? 0),
      icon: ShieldAlert,
      iconClass: "text-red-400 bg-red-500/15 border-red-500/25",
    },
    {
      titleKey: "threats.highRiskEvents",
      value: String(m.active_threats.High ?? 0),
      icon: ShieldAlert,
      iconClass: "text-orange-400 bg-orange-500/15 border-orange-500/25",
    },
    {
      titleKey: "threats.blockedAttacks",
      value: String(peakAlerts),
      icon: Ban,
      iconClass: "text-sky-400 bg-sky-500/15 border-sky-500/25",
    },
    {
      titleKey: "threats.aiDetectionAccuracy",
      value: `${m.ai_confidence}%`,
      icon: Brain,
      iconClass: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25",
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
            <div
              className={`grid size-9 shrink-0 place-items-center rounded-xl border ${c.iconClass}`}
            >
              <Icon className="size-4" />
            </div>
            <div className="mt-3 text-xs text-white/45">{t(c.titleKey)}</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-white">
              {c.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
