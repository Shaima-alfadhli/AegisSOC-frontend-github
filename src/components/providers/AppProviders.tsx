"use client";

import { LocaleProvider } from "@/components/providers/LocaleProvider";
import type { Locale } from "@/lib/i18n/translations";
import { SearchProvider } from "@/components/providers/SearchProvider";

export function AppProviders({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  return (
    <LocaleProvider initialLocale={initialLocale}>
      <SearchProvider>{children}</SearchProvider>
    </LocaleProvider>
  );
}
