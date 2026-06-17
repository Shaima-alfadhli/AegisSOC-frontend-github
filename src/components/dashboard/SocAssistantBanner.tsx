"use client";

import { cn } from "@/lib/utils/cn";
import { ShieldCheck } from "lucide-react";
import { useT } from "@/components/providers/LocaleProvider";

export function SocAssistantBanner({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { t } = useT();

  return (
    <div
      className={cn(
        "flex h-full flex-col justify-center border border-cyan-400/20 bg-cyan-400/5 px-4 py-4 text-sm text-white/75",
        compact ? "rounded-none" : "rounded-2xl",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-cyan-300" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-sm font-medium leading-snug text-white">
            {t("copilot.bannerTitle")}
          </p>
          <p className="text-xs leading-relaxed text-white/55">
            {t("copilot.bannerBody")}
          </p>
        </div>
      </div>
    </div>
  );
}
