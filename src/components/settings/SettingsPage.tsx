"use client";

import { User } from "lucide-react";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { useSearch } from "@/components/providers/SearchProvider";
import { useT } from "@/components/providers/LocaleProvider";
import { textMatches } from "@/lib/search";
const notificationKeys = [
  { id: "n1", key: "settingsPage.notifCritical", enabled: true },
  { id: "n2", key: "settingsPage.notifCopilot", enabled: true },
  { id: "n3", key: "settingsPage.notifDaily", enabled: false },
  { id: "n4", key: "settingsPage.notifLogin", enabled: true },
] as const;

export function SettingsPage() {
  const { query, matches } = useSearch();
  const { t } = useT();
  const visibleNotifications = notificationKeys.filter((n) =>
    textMatches(query, t(n.key), "notifications", "settings")
  );
  const showProfile = matches(
    "Profile",
    t("settingsPage.profile"),
    t("nav.role"),
    t("common.user"),
    t("common.email")
  );
  const showAi = matches("AI", "OpenAI", "Copilot", "gpt", "engine");
  const showNotifications =
    visibleNotifications.length > 0 || !query.trim();

  if (
    query.trim() &&
    !showProfile &&
    !showAi &&
    !showNotifications
  ) {
    return (
      <>
        <PageTopBar
          titleKey="pages.settings.title"
          subtitleKey="pages.settings.subtitle"
        />
        <p className="rounded-2xl aegis-panel-flat px-4 py-8 text-center text-sm text-white/50">
          {t("common.noResults")} &quot;{query}&quot;
        </p>
      </>
    );
  }

  return (
    <>
      <PageTopBar
        titleKey="pages.settings.title"
        subtitleKey="pages.settings.subtitle"
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {showProfile ? (
        <section className="rounded-2xl aegis-panel p-4">
          <h2 className="text-sm font-medium text-white">{t("settingsPage.profile")}</h2>
          <div className="mt-4 flex flex-col items-center gap-3 py-6 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-white/10 text-cyan-100 ring-2 ring-white/10">
              <User className="size-8" />
            </div>
            <p className="text-sm text-white/50">{t("common.noData")}</p>
          </div>
        </section>
        ) : null}

        {showAi ? (
        <section className="rounded-2xl aegis-panel p-4">
          <h2 className="text-sm font-medium text-white">{t("settingsPage.aiEngine")}</h2>
          <p className="mt-2 text-xs text-white/45">
            {t("settingsPage.aiEngineHint")}
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-white/6 pb-2">
              <dt className="text-white/45">{t("settingsPage.provider")}</dt>
              <dd className="text-white/80">openai_compat</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-white/6 pb-2">
              <dt className="text-white/45">{t("settingsPage.model")}</dt>
              <dd className="text-white/80">gpt-4o-mini</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/45">{t("common.status")}</dt>
              <dd className="text-emerald-400">{t("common.aiActive")}</dd>
            </div>
          </dl>
        </section>
        ) : null}

        {showNotifications ? (
        <section className="rounded-2xl aegis-panel p-4 lg:col-span-2">
          <h2 className="text-sm font-medium text-white">{t("settingsPage.notifications")}</h2>
          <ul className="mt-4 divide-y divide-white/6">
            {(query.trim() ? visibleNotifications : notificationKeys).map((n) => (
              <li
                key={n.id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <span className="text-white/75">{t(n.key)}</span>
                <span
                  className={
                    n.enabled
                      ? "rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-xs text-emerald-300"
                      : "rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/40"
                  }
                >
                  {n.enabled ? t("common.on") : t("common.off")}
                </span>
              </li>
            ))}
          </ul>
        </section>
        ) : null}

        {matches("Appearance", "Theme", "Dark", t("settingsPage.appearance")) || !query.trim() ? (
        <section className="rounded-2xl aegis-panel-flat p-4 lg:col-span-2">
          <h2 className="text-sm font-medium text-white">{t("settingsPage.appearance")}</h2>
          <p className="mt-2 text-sm text-white/50">
            {t("settingsPage.appearanceHint")}
          </p>
        </section>
        ) : null}
      </div>
    </>
  );
}
