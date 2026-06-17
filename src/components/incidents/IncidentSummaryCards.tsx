"use client";

import type { Incident } from "@/lib/api.types";
import { AlertTriangle, CheckCircle2, Clock, FolderOpen } from "lucide-react";
import { useT } from "@/components/providers/LocaleProvider";

export function IncidentSummaryCards({ incidents }: { incidents: Incident[] }) {
  const { t } = useT();

  const open = incidents.filter((i) => i.status === "Open" || !i.status).length;
  const resolved = incidents.filter((i) => i.status === "Resolved").length;

  const cards = [
    {
      titleKey: "metrics.totalIncidents",
      value: String(incidents.length),
      icon: FolderOpen,
      iconClass: "text-cyan-300 bg-cyan-500/15 border-cyan-500/25",
    },
    {
      titleKey: "metrics.openIncidents",
      value: String(open),
      icon: AlertTriangle,
      iconClass: "text-red-300 bg-red-500/15 border-red-500/25",
    },
    {
      titleKey: "metrics.resolvedIncidents",
      value: String(resolved),
      icon: CheckCircle2,
      iconClass: "text-emerald-300 bg-emerald-500/15 border-emerald-500/25",
    },
    {
      titleKey: "metrics.mttr",
      value: incidents.length ? "—" : "0",
      icon: Clock,
      iconClass: "text-amber-300 bg-amber-500/15 border-amber-500/25",
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
          </div>
        );
      })}
    </div>
  );
}
