"use client";

import type { ThreatActivityPoint } from "@/lib/api";
import { useT } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils/cn";
import type { Locale } from "@/lib/i18n/translations";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SERIES = [
  { key: "alerts", color: "rgba(59,231,255,0.9)", labelKey: "threats.alerts" },
  { key: "critical", color: "rgba(239,68,68,0.9)", labelKey: "severity.Critical" },
  { key: "high", color: "rgba(249,115,22,0.9)", labelKey: "severity.High" },
  { key: "medium", color: "rgba(234,179,8,0.9)", labelKey: "severity.Medium" },
  { key: "low", color: "rgba(255,255,255,0.25)", labelKey: "severity.Low" },
] as const;

type SeriesKey = (typeof SERIES)[number]["key"];

function hourLabel(h: number, locale: Locale) {
  const v = h % 12 === 0 ? 12 : h % 12;
  if (locale === "ar") {
    return `${v} ${h < 12 ? "ص" : "م"}`;
  }
  return `${v} ${h < 12 ? "AM" : "PM"}`;
}

function seriesLabel(key: SeriesKey, t: (key: string) => string) {
  const item = SERIES.find((s) => s.key === key);
  return item ? t(item.labelKey) : key;
}

function ChartTooltip({
  active,
  payload,
  label,
  locale,
  t,
}: {
  active?: boolean;
  payload?: { dataKey?: string; value?: number; color?: string }[];
  label?: string | number;
  locale: Locale;
  t: (key: string) => string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-xl border border-white/12 px-3 py-2 text-xs text-white shadow-lg"
      style={{ background: "rgba(12,15,25,0.92)" }}
    >
      <div className="mb-2 font-medium text-white/90">
        {hourLabel(Number(label), locale)}
      </div>
      <ul className="space-y-1">
        {payload.map((entry) => {
          const key = String(entry.dataKey ?? "") as SeriesKey;
          return (
            <li key={key} className="flex items-center justify-between gap-4">
              <span className="text-white/70">{seriesLabel(key, t)}</span>
              <span className="font-medium tabular-nums" style={{ color: entry.color }}>
                {entry.value ?? 0}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ThreatActivityChart({
  points,
  title,
  subtitle,
  titleKey,
  subtitleKey,
  compact = false,
}: {
  points: ThreatActivityPoint[];
  title?: string;
  subtitle?: string;
  titleKey?: string;
  subtitleKey?: string;
  compact?: boolean;
}) {
  const { t, locale } = useT();
  const resolvedTitle = titleKey ? t(titleKey) : (title ?? t("pages.threats.timelineTitle"));
  const resolvedSubtitle = subtitleKey ? t(subtitleKey) : (subtitle ?? t("pages.threats.timelineSub"));
  const data = points.map((p) => ({
    hour: p.ts,
    alerts: p.alerts,
    critical: p.critical,
    high: p.high,
    medium: p.medium,
    low: p.low,
  }));

  const peakAlerts = Math.max(...points.map((p) => p.alerts), 0);

  return (
    <div
      className={cn(
        "flex h-full flex-col aegis-panel p-4",
        compact ? "min-h-0 rounded-none" : "min-h-[360px] rounded-2xl"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-white">{resolvedTitle}</div>
          <div className="text-xs text-white/50">{resolvedSubtitle}</div>
        </div>
        <div className="rounded-xl aegis-chip px-3 py-1 text-xs text-white/70">
          {peakAlerts} {t("threats.alerts")}
        </div>
      </div>

      <div className="mt-3 h-[260px] min-h-[260px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={data} margin={{ left: 0, right: 12, top: 10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="hour"
              tickFormatter={(h) => hourLabel(Number(h), locale)}
              stroke="rgba(255,255,255,0.35)"
              tick={{ fontSize: 11 }}
              interval={3}
            />
            <YAxis
              stroke="rgba(255,255,255,0.35)"
              tick={{ fontSize: 11 }}
              width={30}
            />
            <Tooltip content={<ChartTooltip locale={locale} t={t} />} />
            {SERIES.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                dot={false}
                strokeWidth={s.key === "alerts" ? 2 : 1}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/60">
        {SERIES.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: s.color }}
              aria-hidden
            />
            {t(s.labelKey)}
          </span>
        ))}
      </div>
    </div>
  );
}
