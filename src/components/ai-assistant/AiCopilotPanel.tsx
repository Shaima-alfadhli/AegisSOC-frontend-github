"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearch } from "@/components/providers/SearchProvider";
import { useT } from "@/components/providers/LocaleProvider";
import { filterIncidents } from "@/lib/search";
import type { AiCopilotResponse, Incident } from "@/lib/api";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils/cn";
import { AiCopilotBrain } from "@/components/ai-assistant/AiCopilotBrain";
import {
  freezePanelClass,
  investigatePanelClass,
  panelActionGridClass,
} from "@/lib/utils/severityStyles";
import { labelSeverity } from "@/lib/i18n/translations";
import {
  AlertTriangle,
  FileSearch,
  LockKeyhole,
  RefreshCw,
  UserCheck,
} from "lucide-react";

function clamp(n: number) {
  return Math.max(0, Math.min(100, n));
}

export function AiCopilotPanel({
  incidents,
  compact = false,
}: {
  incidents: Incident[];
  compact?: boolean;
}) {
  const { t, locale } = useT();
  const [incidentId, setIncidentId] = useState<string>(incidents[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiCopilotResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analystApproved, setAnalystApproved] = useState<boolean | null>(null);

  const { query } = useSearch();
  const searchableIncidents = useMemo(
    () => filterIncidents(query, incidents),
    [incidents, query]
  );

  const selected = useMemo(
    () =>
      searchableIncidents.find((i) => i.id === incidentId) ??
      searchableIncidents[0] ??
      incidents[0],
    [searchableIncidents, incidents, incidentId]
  );

  useEffect(() => {
    setAnalystApproved(null);
    setError(null);
    if (selected?.ai_assessment) {
      setResult(selected.ai_assessment);
    } else {
      setResult(null);
    }
  }, [selected?.id, selected?.ai_assessment_status, selected?.ai_assessment]);

  useEffect(() => {
    if (!selected?.id || selected.ai_assessment) return;
    const status = selected.ai_assessment_status;
    if (status !== "pending" && status !== "processing") return;

    let cancelled = false;
    const poll = async () => {
      try {
        const list = await api.incidents();
        const fresh = list.find((i) => i.id === selected.id);
        if (!cancelled && fresh?.ai_assessment) {
          setResult(fresh.ai_assessment);
        }
      } catch {
        /* backend warming */
      }
    };
    poll();
    const timer = setInterval(poll, 10_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [selected?.id, selected?.ai_assessment, selected?.ai_assessment_status]);

  const risk = clamp(result?.risk_score ?? selected?.ai_risk_score ?? 92);
  const riskLevelKey = risk >= 85 ? "Critical" : risk >= 70 ? "High" : "Medium";
  const riskLevel = labelSeverity(locale, riskLevelKey);
  const needsAnalyst =
    result?.analyst_decision_required ?? risk >= 70;
  const summary = result?.summary ?? t("copilot.defaultSummary");
  const interpretation = result?.interpretation ?? t("copilotPanel.defaultInterpretation");
  const analystNote = result?.analyst_note ?? t("copilotPanel.analystNote");
  const actions =
    result?.recommended_actions?.length
      ? result.recommended_actions
      : [
          t("copilotPanel.actionCorrelate"),
          t("copilotPanel.actionRevoke"),
          t("copilotPanel.actionTicket"),
        ];

  async function run() {
    setLoading(true);
    setError(null);
    setAnalystApproved(null);
    try {
      const analyzePrompt =
        locale === "ar"
          ? `حلّل هذه الحادثة واشرح المخاطر واقترح خطوات للمحلل.\nالعنوان: ${selected?.title ?? ""}`
          : `Analyze this incident: explain risk and propose action steps for the analyst.\nTitle: ${selected?.title ?? ""}`;
      const res = await api.copilot({
        incident_id: selected?.id ?? null,
        prompt: analyzePrompt,
        locale,
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("copilotPanel.copilotFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col aegis-panel p-4",
        compact ? "min-h-0 rounded-none" : "min-h-[320px] rounded-2xl"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium text-white">{t("copilotPanel.title")}</div>
        </div>
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className={cn(
            "shrink-0 rounded-xl border px-2.5 py-1.5 text-xs font-medium",
            loading
              ? "border-white/10 text-white/40"
              : "border-cyan-400/25 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/15"
          )}
        >
          <RefreshCw className={cn("inline size-3.5", loading && "animate-spin")} />
          {" "}{t("copilotPanel.analyze")}
        </button>
      </div>

      <select
        value={incidentId}
        onChange={(e) => {
          setIncidentId(e.target.value);
          setAnalystApproved(null);
        }}
        className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/80 outline-none"
      >
        {(query.trim() ? searchableIncidents : incidents).map((i) => (
          <option key={i.id} value={i.id}>
            {i.title}
          </option>
        ))}
      </select>

      {selected?.ai_assessment_status === "pending" || selected?.ai_assessment_status === "processing" ? (
        <p className="mt-2 text-xs text-cyan-200/80">{t("common.analyzing")}…</p>
      ) : null}

      {error ? (
        <p className="mt-2 text-xs text-red-300">{error}</p>
      ) : null}

      {needsAnalyst && analystApproved === null ? (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">
          <UserCheck className="mt-0.5 size-4 shrink-0" />
          <span>
            <span className="font-medium">{t("copilotPanel.analystRequired")}</span>
            {" — "}{t("copilotPanel.noAutoExec")} {riskLevel} ({risk}/100)
          </span>
        </div>
      ) : null}

      <div className="relative mt-3 flex-1 overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/10 p-4">
        <div className="pointer-events-none absolute -end-4 top-1/2 hidden -translate-y-1/2 sm:block">
          <AiCopilotBrain size="xl" className="opacity-90 max-sm:opacity-40" />
        </div>

        <p className="relative max-w-full text-sm font-medium leading-snug text-white sm:max-w-[85%] lg:max-w-[58%]">
          {summary}
        </p>
        <p className="relative mt-2 max-w-full text-xs leading-relaxed text-white/60 sm:max-w-[85%] lg:max-w-[58%]">
          <span className="font-medium text-white/45">{t("copilotPanel.interpretation")}: </span>
          {interpretation}
        </p>
        <p className="relative mt-2 text-xs text-red-300/90">
          {t("copilotPanel.risk")}:{" "}
          <span className="font-semibold text-red-300">
            {riskLevel} · {risk}/100
          </span>
        </p>

        <p className="relative mt-4 text-xs font-medium text-white/50">
          {t("copilotPanel.proposedSteps")}
        </p>
        <ol className="relative mt-2 list-decimal space-y-1.5 ps-4 text-xs text-white/75">
          {actions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ol>

        <p className="relative mt-3 max-w-full text-[11px] italic text-white/40 sm:max-w-[85%] lg:max-w-[58%]">
          {analystNote}
        </p>
      </div>

      {needsAnalyst ? (
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setAnalystApproved(true)}
            className={cn(
              "rounded-xl border py-2 text-xs font-medium",
              analystApproved === true
                ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-100"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/8"
            )}
          >
            {t("copilotPanel.approvePlan")}
          </button>
          <button
            type="button"
            onClick={() => setAnalystApproved(false)}
            className={cn(
              "rounded-xl border py-2 text-xs font-medium",
              analystApproved === false
                ? "border-amber-400/40 bg-amber-400/15 text-amber-100"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/8"
            )}
          >
            {t("copilotPanel.escalateRevise")}
          </button>
        </div>
      ) : null}

      {analystApproved === true ? (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-300">
          <UserCheck className="size-3.5" />
          {t("copilotPanel.approvedDemo")}
        </p>
      ) : null}

      {analystApproved === false ? (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-200">
          <AlertTriangle className="size-3.5" />
          {t("copilotPanel.escalatedDemo")}
        </p>
      ) : null}

      <div className={cn(panelActionGridClass, needsAnalyst && analystApproved !== true && "opacity-50")}>
        <button
          type="button"
          disabled={needsAnalyst && analystApproved !== true}
          className={investigatePanelClass}
        >
          <FileSearch className="size-3.5 shrink-0" />
          {t("common.investigate")}
        </button>
        <button
          type="button"
          disabled={needsAnalyst && analystApproved !== true}
          className={freezePanelClass}
        >
          <LockKeyhole className="size-3.5 shrink-0" />
          {t("copilotPanel.freezeAccess")}
        </button>
        <button
          type="button"
          className="col-span-2 flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-medium text-white/75 hover:bg-white/8"
        >
          {t("copilotPanel.generateReport")}
        </button>
      </div>
    </div>
  );
}
