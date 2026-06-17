"use client";

import { api } from "@/lib/api";
import { cn } from "@/lib/utils/cn";
import { AiCopilotBrain } from "@/components/ai-assistant/AiCopilotBrain";
import { useT } from "@/components/providers/LocaleProvider";
import {
  FileText,
  MessageSquare,
  Radar,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Target,
} from "lucide-react";
import { textMatches } from "@/lib/search";
import { useMemo, useState, useEffect } from "react";
import { useSearch } from "@/components/providers/SearchProvider";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  welcome?: boolean;
};

export function AiAssistantWorkspace() {
  const { query } = useSearch();
  const { t, locale } = useT();

  const quickActions = [
    { icon: ShieldAlert, key: "aiAssistantPage.quickAnalyze" },
    { icon: Radar, key: "aiAssistantPage.quickSummarize" },
    { icon: MessageSquare, key: "aiAssistantPage.quickExplain" },
    { icon: Target, key: "aiAssistantPage.quickRecommend" },
    { icon: Search, key: "aiAssistantPage.quickHunt" },
    { icon: FileText, key: "aiAssistantPage.quickReport" },
  ];

  const history = [
    { titleKey: "aiAssistantPage.histImpossibleTravel", timeKey: "aiAssistantPage.time2min" },
    { titleKey: "aiAssistantPage.histFailedLogin", timeKey: "aiAssistantPage.time18min" },
    { titleKey: "aiAssistantPage.histPrivilege", timeKey: "aiAssistantPage.time1hr" },
    { titleKey: "aiAssistantPage.histWeekly", timeKey: "aiAssistantPage.timeYesterday" },
  ];

  const capabilities = [
    "aiAssistantPage.capThreatAnalysis",
    "aiAssistantPage.capRiskAssessment",
    "aiAssistantPage.capAnalystInterpretation",
    "aiAssistantPage.capActionGuidance",
    "aiAssistantPage.capHumanInLoop",
    "aiAssistantPage.capEncryptedLogs",
  ] as const;

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    setMessages([
      { role: "assistant", content: t("aiAssistantPage.welcome"), welcome: true },
    ]);
  }, [locale, t]);

  const filteredHistory = useMemo(
    () =>
      history.filter((h) =>
        textMatches(query, t(h.titleKey), t(h.timeKey))
      ),
    [query, t]
  );

  async function send(prompt?: string) {
    const text = (prompt ?? input).trim();
    if (!text) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    const apiMessages = [...messages, userMsg]
      .filter((m) => !m.welcome)
      .map(({ role, content }) => ({ role, content }));

    try {
      const res = await api.chat({ messages: apiMessages, locale });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            e instanceof Error
              ? `${t("copilotPanel.copilotFailed")}: ${e.message}`
              : t("copilotPanel.copilotFailed"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:items-stretch">
      <div className="xl:col-span-2">
        <div className="rounded-2xl aegis-panel-flat p-4">
          <div className="text-xs font-medium text-white/45">{t("aiAssistantPage.startConversation")}</div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 xl:flex-col xl:overflow-visible xl:pb-0">
            {quickActions.map(({ icon: Icon, key }) => (
              <button
                key={key}
                type="button"
                onClick={() => send(t(key))}
                className="flex shrink-0 items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-left text-xs text-white/70 hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-white xl:w-full"
              >
                <Icon className="size-3.5 shrink-0 text-cyan-300/80" />
                {t(key)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-[360px] flex-col md:min-h-[480px] xl:col-span-7 xl:min-h-[520px]">
        <div className="flex flex-1 flex-col rounded-2xl aegis-panel p-4">
          <div className="mb-3 border-b border-white/8 pb-3">
            <div className="text-sm font-medium text-white">{t("aiAssistantPage.copilotTitle")}</div>
            <div className="text-xs text-white/45">{t("copilot.askAbout")}</div>
          </div>

          <div className="relative flex flex-1 flex-col gap-4 overflow-y-auto pe-1">
            <div className="pointer-events-none absolute bottom-0 end-0 z-0 hidden sm:block">
              <AiCopilotBrain size="xl" className="opacity-85" />
            </div>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "relative z-10 max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "ms-auto border border-cyan-400/20 bg-cyan-400/10 text-cyan-50"
                    : "border border-white/8 bg-white/[0.04] text-white/80"
                )}
              >
                {msg.role === "assistant" ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  msg.content
                )}
              </div>
            ))}
            {loading ? (
              <div className="relative z-10 flex items-center gap-2 text-xs text-white/40">
                <Sparkles className="size-3.5 animate-pulse text-cyan-300" />
                {t("common.analyzing")}
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder={t("aiAssistantPage.askPlaceholder")}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/40"
            />
            <button
              type="button"
              onClick={() => send()}
              disabled={loading}
              className="grid size-9 place-items-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-100 disabled:opacity-40"
              aria-label={t("common.send")}
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 xl:col-span-3">
        <div className="rounded-2xl aegis-panel-flat p-4">
          <div className="text-xs font-medium text-white/45">{t("aiAssistantPage.conversationHistory")}</div>
          <ul className="mt-3 space-y-2">
            {filteredHistory.map((h) => (
              <li key={h.titleKey}>
                <button
                  type="button"
                  className="w-full rounded-lg border border-white/6 bg-white/[0.03] px-3 py-2 text-left hover:border-cyan-400/15"
                >
                  <div className="text-xs font-medium text-white/80">{t(h.titleKey)}</div>
                  <div className="text-[10px] text-white/40">{t(h.timeKey)}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl aegis-panel-flat p-4">
          <div className="text-xs font-medium text-white/45">{t("aiAssistantPage.aiCapabilities")}</div>
          <ul className="mt-3 space-y-2">
            {capabilities.map((key) => (
              <li
                key={key}
                className="flex items-center justify-between text-xs text-white/70"
              >
                <span>{t(key)}</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  {t("aiAssistantPage.capabilityActive")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
