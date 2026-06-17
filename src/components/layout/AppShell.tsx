"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBarActions } from "@/components/layout/TopBarActions";
import { GlobalSearch } from "@/components/shared/GlobalSearch";
import { useT } from "@/components/providers/LocaleProvider";
import { publicAsset } from "@/lib/publicAsset";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useT();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-row flex-nowrap items-stretch bg-[var(--bg)] rtl:flex-row-reverse">
      <Sidebar />
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <main className="flex min-h-screen min-w-0 flex-1 flex-col">
        <div className="aegis-safe-top sticky top-0 z-40 border-b border-white/8 bg-[var(--bg)]/95 backdrop-blur-md">
          <div className="flex items-center gap-2 px-4 py-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label={t("common.openMenu")}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav"
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/80"
            >
              <Menu className="size-5" />
            </button>

            <Link
              href="/"
              className="flex min-w-0 flex-1 items-center gap-2"
              onClick={() => setMobileNavOpen(false)}
            >
              <Image
                src={publicAsset("/brand/aegissoc-logo.png")}
                alt="AegisSOC"
                width={32}
                height={32}
                className="size-8 shrink-0 object-contain"
              />
              <span className="truncate text-sm font-semibold text-white">
                AegisSOC
              </span>
            </Link>

            <TopBarActions compact />
          </div>

          <div className="flex items-center gap-2 px-4 pb-3 sm:gap-3 lg:px-6 lg:py-3">
            <GlobalSearch
              placeholder={t("common.searchAll")}
              className="min-w-0 flex-1"
              fullWidth
            />
            <TopBarActions className="hidden lg:flex" />
          </div>
        </div>

        <div className="aegis-safe-bottom flex flex-1 flex-col gap-4 p-4 pb-6 sm:gap-5 sm:p-5 lg:p-6 lg:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
