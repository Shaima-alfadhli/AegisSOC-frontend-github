"use client";

import { cn } from "@/lib/utils/cn";
import { useLocale, useT } from "@/components/providers/LocaleProvider";
import type { Locale } from "@/lib/i18n/translations";

export function LanguageToggle({ compact }: { compact?: boolean }) {
  const { locale, setLocale } = useLocale();
  const { t } = useT();

  const nextLocale: Locale = locale === "en" ? "ar" : "en";
  const label = nextLocale === "ar" ? t("common.arabic") : t("common.english");
  const shortLabel = nextLocale === "ar" ? "AR" : "EN";

  return (
    <button
      type="button"
      onClick={() => setLocale(nextLocale)}
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-cyan-100 transition hover:bg-cyan-400/10",
        compact && "grid h-10 min-w-10 place-items-center px-2.5"
      )}
      aria-label={label}
      title={label}
    >
      {shortLabel}
    </button>
  );
}
