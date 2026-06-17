"use client";

import { cn } from "@/lib/utils/cn";
import type { DashboardMetrics } from "@/lib/api";
import { severityDotClass } from "@/lib/utils/severityStyles";
import { useT } from "@/components/providers/LocaleProvider";
import { labelSeverity } from "@/lib/i18n/translations";

function Ring({
  value,
  label,
  sublabel,
  color,
  centered,
}: {
  value: number;
  label: string;
  sublabel: string;
  color: string;
  centered?: boolean;
}) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  const ring = (
    <svg width="96" height="96" viewBox="0 0 96 96" className="shrink-0">
      <circle
        cx="48"
        cy="48"
        r={radius}
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="10"
        fill="none"
      />
      <circle
        cx="48"
        cy="48"
        r={radius}
        stroke={color}
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
        transform="rotate(-90 48 48)"
      />
      <text
        x="48"
        y="52"
        textAnchor="middle"
        className="fill-white font-semibold"
        style={{ fontSize: 22 }}
      >
        {value}
      </text>
    </svg>
  );

  const text = (
    <div className={cn("min-w-0", centered && "text-center")}>
      <div className="text-sm font-medium text-white">{label}</div>
      <div className="mt-0.5 text-xs text-white/50">{sublabel}</div>
    </div>
  );

  if (centered) {
    return (
      <div className="flex flex-col items-center gap-3 py-1">
        {ring}
        {text}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {ring}
      {text}
    </div>
  );
}

export function MetricCards({ m }: { m: DashboardMetrics }) {
  const { t, locale } = useT();
  const delta = m.incidents_delta_vs_yesterday;
  const deltaUp = delta > 0;
  const severities = ["Critical", "High", "Medium", "Low"] as const;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch">
      <div className="flex h-full min-h-[168px] flex-col rounded-2xl aegis-panel-flat p-4">
        <div className="text-xs text-white/50">{t("metrics.securityScore")}</div>
        <div className="mt-auto flex flex-1 items-center justify-center">
          <Ring
            value={m.security_score}
            label={m.security_status === "Secure" ? t("metrics.secure") : m.security_status}
            sublabel={t("metrics.systemsNormal")}
            color="var(--cyan)"
            centered
          />
        </div>
      </div>

      <div className="flex h-full min-h-[168px] flex-col rounded-2xl aegis-panel-flat p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-white/50">{t("metrics.activeThreats")}</div>
          <button
            type="button"
            className="text-xs text-cyan-300/90 hover:text-cyan-200"
          >
            {t("common.viewAll")}
          </button>
        </div>
        <div className="mt-3 flex flex-1 flex-col justify-center space-y-2.5">
          {severities.map((k) => (
            <div key={k} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-white/75">
                <span
                  className={`size-2 shrink-0 rounded-full ${severityDotClass(k)}`}
                />
                {labelSeverity(locale, k)}
              </div>
              <span className="font-semibold tabular-nums text-white">
                {m.active_threats[k] ?? 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex h-full min-h-[168px] flex-col rounded-2xl aegis-panel-flat p-4">
        <div className="text-xs text-white/50">{t("metrics.incidentsToday")}</div>
        <div className="mt-2 flex items-start justify-between gap-2">
          <div>
            <div className="text-4xl font-semibold leading-none tracking-tight text-white">
              {m.incidents_today}
            </div>
            <div className="mt-1 text-xs text-white/45">18 May 2026</div>
            <div
              className={cn(
                "mt-1 text-xs font-medium",
                deltaUp ? "text-red-400" : "text-emerald-400"
              )}
            >
              {deltaUp ? "↑" : "↓"} {Math.abs(delta)} {t("metrics.fromYesterday")}
            </div>
          </div>
          <div className="mt-1 flex h-14 w-20 shrink-0 items-end gap-0.5">
            {[35, 55, 40, 70, 45, 60, 50].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-cyan-500/50 to-purple-500/30"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex h-full min-h-[168px] flex-col rounded-2xl aegis-panel-flat p-4">
        <div className="text-xs text-white/50">{t("metrics.aiConfidence")}</div>
        <div className="mt-auto flex flex-1 items-center justify-center">
          <Ring
            value={m.ai_confidence}
            label={t("metrics.aiEngineActive")}
            sublabel={t("metrics.aiEngineSub")}
            color="var(--teal)"
            centered
          />
        </div>
      </div>
    </div>
  );
}
