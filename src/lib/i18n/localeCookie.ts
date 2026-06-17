import { LOCALE_STORAGE_KEY, type Locale } from "@/lib/i18n/translations";

export function parseLocale(value: string | undefined | null): Locale {
  return value === "ar" ? "ar" : "en";
}

export function persistLocale(locale: Locale) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  document.cookie = `${LOCALE_STORAGE_KEY}=${locale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
}
