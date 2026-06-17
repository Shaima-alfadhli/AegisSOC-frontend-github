"use client";

import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { NavList } from "@/components/layout/NavList";
import { useT } from "@/components/providers/LocaleProvider";
import { publicAsset } from "@/lib/publicAsset";

export function Sidebar() {
  const { t } = useT();

  return (
    <aside className="aegis-sidebar hidden shrink-0 grow-0 lg:flex lg:w-[248px] lg:flex-col lg:bg-black/20">
      <div className="flex items-center gap-3 px-5 py-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl">
            <Image
              src={publicAsset("/brand/aegissoc-logo.png")}
              alt="AegisSOC"
              width={40}
              height={40}
              priority
              className="object-contain"
            />
          </div>
          <div className="truncate font-semibold tracking-tight text-white">
            AegisSOC
          </div>
        </Link>
      </div>

      <NavList className="flex-1 px-3" />

      <div className="px-4 pb-6 pt-2">
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
  );
}
