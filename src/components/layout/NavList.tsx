"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/components/providers/LocaleProvider";
import { isNavActive, NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils/cn";

export function NavList({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const { t } = useT();

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {NAV_ITEMS.map(({ icon: Icon, labelKey, href }) => {
        const active = isNavActive(pathname, href);
        const label = t(labelKey);

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "relative flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-start text-sm transition-all duration-200",
              active
                ? "border-cyan-400/25 bg-cyan-400/15 ps-4 text-white shadow-[inset_0_0_20px_rgba(59,231,255,0.08)]"
                : "border-transparent text-white/65 hover:border-white/10 hover:bg-white/5 hover:text-white"
            )}
          >
            <span
              className={cn(
                "absolute start-0 top-1/2 h-6 w-1 origin-center -translate-y-1/2 rounded-e-full bg-cyan-400 transition-all duration-200",
                active ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
              )}
            />
            <Icon
              className={cn(
                "size-4 shrink-0 transition-colors duration-200",
                active ? "text-cyan-300" : "text-inherit"
              )}
            />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
