"use client";

import { useT } from "@/components/providers/LocaleProvider";

export function PageTopBar({
  title,
  subtitle,
  titleKey,
  subtitleKey,
}: {
  title?: string;
  subtitle?: string;
  titleKey?: string;
  subtitleKey?: string;
}) {
  const { t } = useT();
  const resolvedTitle = titleKey ? t(titleKey) : (title ?? "");
  const resolvedSubtitle = subtitleKey ? t(subtitleKey) : (subtitle ?? "");

  return (
    <header>
      <h1 className="text-2xl font-semibold tracking-tight text-white">
        {resolvedTitle}
      </h1>
      <p className="mt-0.5 text-sm text-white/50">{resolvedSubtitle}</p>
    </header>
  );
}
