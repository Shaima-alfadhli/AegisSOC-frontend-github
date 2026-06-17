"use client";

import { AiCopilotBrain } from "@/components/ai-assistant/AiCopilotBrain";
import { useT } from "@/components/providers/LocaleProvider";
import {
  freezePanelClass,
  investigatePanelClass,
  isolatePanelClass,
  panelActionGridClass,
} from "@/lib/utils/severityStyles";
import {
  FileSearch,
  LockKeyhole,
  Server,
  Monitor,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function AiThreatIntelligence({ compact = false }: { compact?: boolean }) {
  const { t } = useT();

  const assets = [
    { icon: Server, label: t("threatsPage.servers") },
    { icon: Monitor, label: t("threatsPage.endpoints") },
    { icon: Database, label: t("threatsPage.database") },
  ];

  return (
    <div
      className={cn(
        "flex h-full flex-col aegis-panel p-4",
        compact ? "min-h-0 rounded-none" : "min-h-[360px] rounded-2xl"
      )}
    >
      <div>
        <div className="text-sm font-medium text-white">{t("threatsPage.aiThreatIntelligence")}</div>
        <div className="text-xs text-white/45">{t("threatsPage.realTimeAnalysis")}</div>
      </div>

      <div className="relative mt-4 flex-1 overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-600/15 p-4">
        <div className="pointer-events-none absolute -end-4 top-1/2 hidden -translate-y-1/2 sm:block">
          <AiCopilotBrain size="xl" className="opacity-90" />
        </div>

        <p className="relative max-w-full text-sm font-medium leading-snug text-white sm:max-w-[85%] lg:max-w-[58%]">
          {t("threatsPage.lateralMovement")}
        </p>
        <p className="relative mt-2 text-sm text-red-300">
          {t("common.riskScore")}: <span className="font-semibold">94/100</span>
        </p>

        <p className="relative mt-4 text-xs font-medium text-white/45">
          {t("threatsPage.affectedAssets")}
        </p>
        <div className="relative mt-2 flex flex-wrap gap-2">
          {assets.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70"
            >
              <Icon className="size-3.5 text-cyan-300/80" />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className={panelActionGridClass}>
        <button type="button" className={investigatePanelClass}>
          <FileSearch className="size-3.5 shrink-0" />
          {t("common.investigate")}
        </button>
        <button type="button" className={freezePanelClass}>
          <LockKeyhole className="size-3.5 shrink-0" />
          {t("incidentPanel.freezeUser")}
        </button>
        <button type="button" className={isolatePanelClass}>
          {t("threatsPage.isolateDevice")}
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-medium text-white/70 hover:bg-white/8"
        >
          {t("threatsPage.generateReport")}
        </button>
      </div>
    </div>
  );
}
