"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ActivityItem, Incident } from "@/lib/api";
import { api } from "@/lib/api";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  buildSearchResults,
  normalizeQuery,
  textMatches,
  type SearchResultItem,
} from "@/lib/search";

type SearchContextValue = {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResultItem[];
  loading: boolean;
  incidents: Incident[];
  matches: (...parts: (string | null | undefined)[]) => boolean;
  clear: () => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

function readQueryFromUrl(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("q") ?? "";
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLocale();
  const [query, setQueryState] = useState("");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQueryState(readQueryFromUrl());
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [inc, act] = await Promise.all([
          api.incidents(),
          api.activity(),
        ]);
        if (!cancelled) {
          setIncidents(inc);
          setActivity(act);
        }
      } catch {
        /* keep empty — nav/static results still work */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setQuery = useCallback(
    (q: string) => {
      setQueryState(q);
      const params = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : ""
      );
      const trimmed = q.trim();
      if (trimmed) params.set("q", trimmed);
      else params.delete("q");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  const clear = useCallback(() => setQuery(""), [setQuery]);

  const matches = useCallback(
    (...parts: (string | null | undefined)[]) => textMatches(query, ...parts),
    [query]
  );

  const results = useMemo(
    () => buildSearchResults(query, incidents, activity, locale),
    [query, incidents, activity, locale]
  );

  const value = useMemo(
    () => ({
      query,
      setQuery,
      results,
      loading,
      incidents,
      matches,
      clear,
    }),
    [query, setQuery, results, loading, incidents, matches, clear]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}

export function useSearchQuery() {
  return normalizeQuery(useSearch().query);
}
