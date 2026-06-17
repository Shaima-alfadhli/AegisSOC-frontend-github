"use client";

import { useEffect } from "react";
import Image from "next/image";
import { User, X } from "lucide-react";
import { NavList } from "@/components/layout/NavList";
import { useT } from "@/components/providers/LocaleProvider";
import { publicAsset } from "@/lib/publicAsset";
import { cn } from "@/lib/utils/cn";

export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useT();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <button
        type="button"
        aria-label={t("common.closeMenu")}
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        id="mobile-nav"
        aria-hidden={!open}
        className={cn(
          "aegis-sidebar fixed inset-y-0 start-0 z-[60] flex w-[min(100vw-2.5rem,280px)] flex-col bg-[#070a12] shadow-2xl shadow-black/50 transition-transform duration-300 ease-out lg:hidden",
          open
            ? "translate-x-0"
            : "-translate-x-full rtl:translate-x-full"
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl">
              <Image
                src={publicAsset("/brand/aegissoc-logo.png")}
                alt="AegisSOC"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div className="truncate font-semibold tracking-tight text-white">
              AegisSOC
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.closeMenu")}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavList onNavigate={onClose} />
        </div>

        <div className="border-t border-white/8 px-4 py-4">
          <div className="flex items-center gap-3 rounded-2xl aegis-panel-flat px-3 py-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-cyan-100 ring-2 ring-white/10">
              <User className="size-5" />
            </div>
            <div className="min-w-0 flex-1 text-start">
              <div className="truncate text-sm font-medium">{t("common.user")}</div>
              <div className="text-xs text-white/50">{t("nav.role")}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
