"use client";

import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { UserMenuDropdown } from "@/components/shared/UserMenuDropdown";
import { useT } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils/cn";
import { Bell, Sparkles } from "lucide-react";

export function TopBarActions({
  notificationCount = 6,
  compact = false,
  className,
}: {
  notificationCount?: number;
  compact?: boolean;
  className?: string;
}) {
  const { t } = useT();

  return (
    <div className={cn("flex shrink-0 items-center gap-1.5 sm:gap-2", className)}>
      <LanguageToggle compact />

      <button
        type="button"
        className="relative grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 sm:size-10 sm:rounded-2xl"
        aria-label={t("common.notifications")}
      >
        <Bell className="size-4 text-white/70" />
        <span className="absolute -end-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
          {notificationCount}
        </span>
      </button>

      <div
        className={cn(
          "flex shrink-0 items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 text-emerald-100",
          compact
            ? "size-9 justify-center sm:size-10"
            : "h-10 gap-2 px-3 text-sm"
        )}
        title={t("common.aiActive")}
      >
        <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
        {compact ? (
          <Sparkles className="size-4 sm:hidden" aria-hidden />
        ) : null}
        {!compact ? <span>{t("common.aiActive")}</span> : null}
      </div>

      <UserMenuDropdown compact={compact} />
    </div>
  );
}
