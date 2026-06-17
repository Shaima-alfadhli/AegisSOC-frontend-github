"use client";

import { useEffect, useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { useT } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils/cn";
import { apiBaseCandidates } from "@/lib/api";

type LogTransportStatus = {
  encryption_in_transit: boolean;
  decrypt_at_platform_boundary?: boolean;
  algorithm?: string;
};

async function fetchLogTransport(): Promise<LogTransportStatus | null> {
  for (const base of apiBaseCandidates()) {
    try {
      const res = await fetch(`${base}/api/log-transport/status`, {
        cache: "no-store",
      });
      if (!res.ok) continue;
      return (await res.json()) as LogTransportStatus;
    } catch {
      /* try next */
    }
  }
  return null;
}

export function LogTransportBadge({ compact = false }: { compact?: boolean }) {
  const { t } = useT();
  const [status, setStatus] = useState<LogTransportStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchLogTransport().then((s) => {
      if (!cancelled) setStatus(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const active = status?.encryption_in_transit ?? false;

  return (
    <div
      className={cn(
        "flex items-center gap-2 border border-violet-400/25 bg-violet-400/10 px-3 py-2 text-xs text-violet-100",
        compact ? "rounded-none" : "rounded-xl"
      )}
      title={status?.algorithm ?? t("logTransport.tooltip")}
    >
      {active ? (
        <Lock className="size-3.5 shrink-0" />
      ) : (
        <Unlock className="size-3.5 shrink-0 opacity-50" />
      )}
      <span>
        <span className="font-medium">{t("logTransport.encrypted")}</span>
        <span className="mx-1 text-white/30">·</span>
        {t("logTransport.decryptAtIngest")}
      </span>
    </div>
  );
}
