"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useSearch } from "@/components/providers/SearchProvider";
import { useT } from "@/components/providers/LocaleProvider";

export function GlobalSearch({
  placeholder = "Search across AegisSOC...",
  className,
  fullWidth = false,
}: {
  placeholder?: string;
  className?: string;
  fullWidth?: boolean;
}) {
  const { query, setQuery, results, loading, clear } = useSearch();
  const { t, rtl } = useT();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const showDropdown = open && query.trim().length > 0;
  const grouped = results.reduce<Record<string, typeof results>>((acc, r) => {
    (acc[r.category] ??= []).push(r);
    return acc;
  }, {});

  const categoryLabel = (category: string) => {
    const key = `search.categories.${category}`;
    const translated = t(key);
    return translated === key ? category : translated;
  };

  return (
    <div ref={rootRef} className={cn("relative", fullWidth && "w-full", className)}>
      <div className="flex h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 focus-within:border-cyan-400/30 focus-within:ring-1 focus-within:ring-cyan-400/20">
        <Search className="size-4 shrink-0 text-white/45" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          aria-label="Global search"
          aria-expanded={showDropdown}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/40",
            fullWidth ? "w-full" : "w-[200px] sm:w-[280px]"
          )}
        />
        {!fullWidth ? (
          <span className="hidden shrink-0 rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-white/30 lg:inline">
            ⌘K
          </span>
        ) : null}
        {query ? (
          <button
            type="button"
            onClick={() => {
              clear();
              setOpen(false);
            }}
            className="grid size-6 place-items-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white/70"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>

      {showDropdown ? (
        <div
          className={cn(
            "absolute top-[calc(100%+8px)] z-50 max-h-[min(480px,70vh)] w-[min(100vw-2rem,480px)] overflow-y-auto rounded-2xl border border-white/10 bg-[#0c1018] p-2 shadow-xl shadow-black/40",
            fullWidth ? "start-0 end-0 w-full" : rtl ? "left-0" : "right-0 sm:w-[420px]"
          )}
        >
          {loading && results.length === 0 ? (
            <p className="px-3 py-4 text-xs text-white/45">{t("common.loadingSearch")}</p>
          ) : results.length === 0 ? (
            <p className="px-3 py-4 text-xs text-white/45">
              {t("common.noResultsFor")} &quot;{query}&quot;
            </p>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-2 last:mb-0">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/35">
                  {categoryLabel(category)} ({items.length})
                </div>
                <ul>
                  {items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={
                          query.trim()
                            ? `${item.href}?q=${encodeURIComponent(query.trim())}`
                            : item.href
                        }
                        onClick={() => setOpen(false)}
                        className="block rounded-xl px-3 py-2 hover:bg-cyan-400/10"
                      >
                        <div className="text-sm font-medium text-white">{item.title}</div>
                        <div className="text-xs text-white/45">{item.subtitle}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
