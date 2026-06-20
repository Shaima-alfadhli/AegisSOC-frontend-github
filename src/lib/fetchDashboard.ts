import type {
  ActivityItem,
  DashboardMetrics,
  ThreatActivityPoint,
  Incident,
} from "@/lib/api.types";

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

// Maps FastAPI incident format → frontend Incident type
function transformIncident(raw: Record<string, unknown>, index: number): Incident {
  const severity = (raw.severity as string) ?? "Medium";
  const validSeverity = ["Critical", "High", "Medium", "Low"].includes(severity)
    ? (severity as Incident["severity"])
    : "Medium";

  const riskScore = Number(raw.risk_score ?? 0);
  const aiVerdict =
    riskScore >= 80 ? "Malicious" : riskScore >= 50 ? "Suspicious" : "Benign";

  const createdAt = raw.created_at ? new Date(raw.created_at as string) : new Date();
  const minutesAgo = Math.floor((Date.now() - createdAt.getTime()) / 60000);

  return {
    id: `inc_${1001 + index}`,
    severity: validSeverity,
    title: (raw.title as string) ?? "Untitled Incident",
    user: (raw.assigned_to as string) ?? "SOC Agent",
    source_ip: (raw.source_ip as string) ?? "—",
    country: "Saudi Arabia",
    minutes_ago: Math.max(0, minutesAgo),
    ai_verdict: aiVerdict,
    incident_type: (raw.incident_type as string) ?? "Security",
    status: (raw.status as Incident["status"]) ?? "Open",
    owner: (raw.assigned_to as string) ?? "AI-Automated-SOC-Agent",
    display_id: `INC-${String(raw.incident_id ?? "").slice(0, 8).toUpperCase()}`,
    description: `${raw.incident_type ?? "Security"} incident on ${raw.host_name ?? "unknown host"}. Risk score: ${riskScore}.`,
    source_type: "live",
    ai_risk_score: riskScore,
    ai_risk_level: validSeverity,
  };
}

// Computes dashboard metrics from live incidents
function computeMetrics(incidents: Incident[]): DashboardMetrics {
  const critical = incidents.filter((i) => i.severity === "Critical").length;
  const high = incidents.filter((i) => i.severity === "High").length;
  const medium = incidents.filter((i) => i.severity === "Medium").length;
  const low = incidents.filter((i) => i.severity === "Low").length;

  return {
    security_score: Math.max(0, 100 - critical * 15 - high * 8 - medium * 3),
    security_status: critical > 0 ? "Critical" : high > 0 ? "At Risk" : "Secure",
    active_threats: { Critical: critical, High: high, Medium: medium, Low: low },
    incidents_today: incidents.length,
    incidents_delta_vs_yesterday: 0,
    ai_confidence: 87,
  };
}

async function fetchRawIncidents(): Promise<Incident[]> {
  const base =
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "";
  try {
    const res = await fetch(`${base}/incidents`, { cache: "no-store" });
    if (!res.ok) return EMPTY_INCIDENTS;
    const raw: Record<string, unknown>[] = await res.json();
    return Array.isArray(raw)
      ? raw.map((r, i) => transformIncident(r, i))
      : EMPTY_INCIDENTS;
  } catch {
    return EMPTY_INCIDENTS;
  }
}

export async function fetchDashboardData() {
  try {
    const incidents = await fetchRawIncidents();
    const metrics = computeMetrics(incidents);
    return {
      metrics,
      points: EMPTY_THREAT_POINTS,
      incidents,
      activity: EMPTY_ACTIVITY,
      connected: true as const,
    };
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
  const incidents = await fetchRawIncidents();
  return {
    incidents,
    connected: incidents.length > 0,
  };
}

export async function fetchThreatsPageData() {
  return fetchDashboardData();
}