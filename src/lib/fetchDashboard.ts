import type {
  ActivityItem,
  DashboardMetrics,
  ThreatActivityPoint,
} from "@/lib/api.types";
import type { Incident } from "@/lib/api.types";

export const EMPTY_METRICS: DashboardMetrics = {
  security_score: 0,
  security_status: "—",
  active_threats: { Critical: 0, High: 0, Medium: 0, Low: 0 },
  incidents_today: 0,
  incidents_delta_vs_yesterday: 0,
  ai_confidence: 0,
};

export const EMPTY_INCIDENTS: Incident[] = [];
export const EMPTY_ACTIVITY: ActivityItem[] = [];
export const EMPTY_THREAT_POINTS: ThreatActivityPoint[] = [];

/** Fetch from API; returns empty defaults when backend is not configured or unreachable. */
export async function fetchDashboardData() {
  const { api } = await import("@/lib/api");
  try {
    const [metrics, points, incidents, activity] = await Promise.all([
      api.metrics(),
      api.threatActivity(),
      api.incidents(),
      api.activity(),
    ]);
    return { metrics, points, incidents, activity, connected: true as const };
  } catch {
    return {
      metrics: EMPTY_METRICS,
      points: EMPTY_THREAT_POINTS,
      incidents: EMPTY_INCIDENTS,
      activity: EMPTY_ACTIVITY,
      connected: false as const,
    };
  }
}

export async function fetchIncidents() {
  const { api } = await import("@/lib/api");
  try {
    return { incidents: await api.incidents(), connected: true as const };
  } catch {
    return { incidents: EMPTY_INCIDENTS, connected: false as const };
  }
}

export async function fetchThreatsPageData() {
  const { api } = await import("@/lib/api");
  try {
    const [metrics, points, incidents, activity] = await Promise.all([
      api.metrics(),
      api.threatActivity(),
      api.incidents(),
      api.activity(),
    ]);
    return { metrics, points, incidents, activity, connected: true as const };
  } catch {
    return {
      metrics: EMPTY_METRICS,
      points: EMPTY_THREAT_POINTS,
      incidents: EMPTY_INCIDENTS,
      activity: EMPTY_ACTIVITY,
      connected: false as const,
    };
  }
}
