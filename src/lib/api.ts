import type {
  AiGovernanceEvent,
  AiGovernanceMetrics,
} from "@/lib/types/aiGovernance";

export type {
  ActivityItem,
  AiChatResponse,
  AiCopilotResponse,
  ApiStatus,
  DashboardMetrics,
  Incident,
  ThreatActivityPoint,
} from "@/lib/api.types";
export type { AiGovernanceEvent, AiGovernanceMetrics } from "@/lib/types/aiGovernance";

const ENV_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/** Same-origin proxy — avoids CORS (see next.config rewrites). */
export const API_PROXY_BASE = "/api/backend";

const DIRECT_API_BASES = [ENV_API_BASE].filter(Boolean) as string[];

export function apiBaseCandidates(): string[] {
  if (!ENV_API_BASE) return [];
  if (typeof window !== "undefined") {
    return [API_PROXY_BASE, ...DIRECT_API_BASES];
  }
  return [...DIRECT_API_BASES, API_PROXY_BASE];
}

export const API_BASE = DIRECT_API_BASES[0] ?? API_PROXY_BASE;

async function tryFetch(url: string, init?: RequestInit, timeoutMs = 1800) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

async function getJson<T>(path: string): Promise<T> {
  let lastErr: unknown = null;
  for (const base of apiBaseCandidates()) {
    try {
      const res = await tryFetch(`${base}${path}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      return (await res.json()) as T;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("fetch failed");
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const isCopilot = path === "/api/ai/copilot";
  const timeoutMs = isCopilot ? 120_000 : 1800;
  let lastErr: unknown = null;
  for (const base of apiBaseCandidates()) {
    try {
      const res = await tryFetch(
        `${base}${path}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        },
        timeoutMs
      );
      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(errBody || `Request failed: ${res.status}`);
      }
      return (await res.json()) as T;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("fetch failed");
}

export async function pingBackend(): Promise<import("@/lib/api.types").ApiStatus | null> {
  for (const base of apiBaseCandidates()) {
    try {
      const res = await tryFetch(`${base}/api/status`, { cache: "no-store" });
      if (!res.ok) continue;
      return (await res.json()) as import("@/lib/api.types").ApiStatus;
    } catch {
      /* try next */
    }
  }
  return null;
}

export const api = {
  status: () => getJson<import("@/lib/api.types").ApiStatus>("/api/status"),
  metrics: () =>
    getJson<import("@/lib/api.types").DashboardMetrics>("/api/dashboard/metrics"),
  threatActivity: () =>
    getJson<import("@/lib/api.types").ThreatActivityPoint[]>(
      "/api/dashboard/threat-activity"
    ),
  incidents: () => getJson<import("@/lib/api.types").Incident[]>("/api/incidents"),
  activity: () =>
    getJson<import("@/lib/api.types").ActivityItem[]>("/api/activity"),
  aiGovernanceMetrics: () =>
    getJson<AiGovernanceMetrics>("/api/ai-governance/metrics"),
  aiGovernanceEvents: () =>
    getJson<AiGovernanceEvent[]>("/api/ai-governance/events"),
  copilot: (payload: {
    incident_id?: string | null;
    prompt: string;
    locale?: "en" | "ar";
    mode?: "analyze";
  }) =>
    postJson<import("@/lib/api.types").AiCopilotResponse>("/api/ai/copilot", {
      ...payload,
      mode: "analyze",
    }),
  chat: (payload: {
    messages: { role: "user" | "assistant"; content: string }[];
    locale?: "en" | "ar";
  }) =>
    postJson<import("@/lib/api.types").AiChatResponse>("/api/ai/copilot", {
      ...payload,
      mode: "chat",
    }),
};
