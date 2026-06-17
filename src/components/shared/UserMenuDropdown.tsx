"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  FileText,
  HelpCircle,
  LogOut,
  Settings,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useLocale, useT } from "@/components/providers/LocaleProvider";

export function UserMenuDropdown({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { t } = useT();
  const { rtl } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const menuLinks = [
    {
      href: "/settings",
      label: t("userMenu.profile"),
      description: t("userMenu.profileSub"),
      icon: User,
    },
    {
      href: "/settings",
      label: t("userMenu.settings"),
      description: t("userMenu.settingsSub"),
      icon: Settings,
    },
    {
      href: "/users",
      label: t("userMenu.team"),
      description: t("userMenu.teamSub"),
      icon: Users,
    },
    {
      href: "/reports",
      label: t("userMenu.myReports"),
      description: t("userMenu.myReportsSub"),
      icon: FileText,
    },
    {
      href: "#",
      label: t("userMenu.help"),
      description: t("userMenu.helpSub"),
      icon: HelpCircle,
      demo: true,
    },
  ] as const;

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "flex h-9 items-center rounded-xl border bg-white/5 transition-colors sm:h-10 sm:rounded-2xl",
          compact ? "size-9 justify-center px-0 sm:size-10" : "gap-2 px-3",
          open
            ? "border-cyan-400/30 ring-1 ring-cyan-400/20"
            : "border-white/10 hover:border-white/15 hover:bg-white/[0.07]"
        )}
      >
        {compact ? (
          <div className="grid size-8 place-items-center rounded-full bg-white/10 text-cyan-100 ring-2 ring-white/10">
            <User className="size-4" />
          </div>
        ) : (
          <>
            <div className={cn("leading-tight", rtl ? "text-right" : "text-left")}>
              <div className="text-sm font-medium text-white">{t("common.user")}</div>
              <div className="text-xs text-white/50">{t("nav.role")}</div>
            </div>
            <ChevronDown
              className={cn(
                "size-4 text-white/50 transition-transform duration-200",
                open && "rotate-180 text-cyan-300/80"
              )}
            />
          </>
        )}
      </button>

      {open ? (
        <div
          role="menu"
          className={cn(
            "absolute top-[calc(100%+8px)] z-50 w-[min(100vw-2rem,260px)] overflow-hidden rounded-2xl border border-white/10 bg-[#0c1018] shadow-xl shadow-black/40",
            rtl ? "left-0" : "right-0"
          )}
        >
          <div className="border-b border-white/8 px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-cyan-100 ring-2 ring-white/10">
                <User className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-white">
                  {t("common.user")}
                </div>
                <div className="truncate text-xs text-white/45">
                  {t("common.noData")}
                </div>
              </div>
            </div>
          </div>

          <ul className="p-1.5">
            {menuLinks.map((item) => {
              const Icon = item.icon;
              if ("demo" in item && item.demo) {
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setOpen(false);
                        window.alert(t("userMenu.helpAlert"));
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/5",
                        rtl ? "text-right" : "text-left"
                      )}
                    >
                      <Icon className="size-4 shrink-0 text-white/45" />
                      <div className="min-w-0">
                        <div className="text-sm text-white/90">{item.label}</div>
                        <div className="text-[11px] text-white/40">
                          {item.description}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              }
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-cyan-400/10"
                  >
                    <Icon className="size-4 shrink-0 text-cyan-300/70" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-white/40">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-white/8 p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                router.push("/");
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-200/90 hover:bg-red-500/10",
                rtl ? "text-right" : "text-left"
              )}
            >
              <LogOut className="size-4 shrink-0 text-red-400/80" />
              <div>
                <div className="text-sm font-medium">{t("common.signOut")}</div>
                <div className="text-[11px] text-white/40">
                  {t("common.signOutHint")}
                </div>
              </div>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
