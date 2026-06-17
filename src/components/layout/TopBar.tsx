"use client";

import { useT } from "@/components/providers/LocaleProvider";

export function TopBar() {
  const { t } = useT();

  return (
    <header>
      <h1 className="text-2xl font-semibold tracking-tight text-white">
        {t("pages.dashboard.title")}
      </h1>
      <p className="mt-0.5 text-sm text-white/50">
        {t("pages.dashboard.subtitle")}
      </p>
    </header>
  );
}
