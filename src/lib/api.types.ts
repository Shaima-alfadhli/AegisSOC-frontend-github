import type {
  AiGovernanceEvent,
  AiGovernanceMetrics,
} from "@/lib/types/aiGovernance";

export type DashboardMetrics = {
  security_score: number;
  security_status: string;
  active_threats: Record<string, number>;
  incidents_today: number;
  incidents_delta_vs_yesterday: number;
  ai_confidence: number;
};

export type ThreatActivityPoint = {
  ts: number;
  alerts: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
};

export type SecureLayerMeta = {
  label: string;
  accepted: boolean;
  steps: { name: string; ok: boolean; detail: string }[];
  ai_safe_preview?: string;
};

export type AiCopilotResponse = {
  summary: string;
  interpretation?: string;
  risk_score: number;
  risk_level?: string;
  recommended_actions: string[];
  analyst_decision_required?: boolean;
  analyst_note?: string;
  model: string;
  provider: string;
  created_at: string;
};

export type Incident = {
  id: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  title: string;
  user: string;
  source_ip: string;
  country: string;
  minutes_ago: number;
  ai_verdict: string;
  incident_type?: string;
  status?: "Open" | "Investigating" | "Under Review" | "Resolved";
  owner?: string;
  display_id?: string;
  description?: string;
  city?: string;
  isp?: string;
  department?: string;
  role?: string;
  source_type?: "seed" | "live";
  secure_layer?: SecureLayerMeta;
  ai_assessment?: AiCopilotResponse;
  ai_assessment_status?: string;
  ai_summary?: string;
  ai_risk_score?: number;
  ai_risk_level?: string;
};

export type ActivityItem = {
  id: string;
  kind: string;
  message: string;
  user?: string | null;
  time_iso: string;
};

export type AiChatResponse = {
  reply: string;
  model: string;
  provider: string;
  created_at: string;
};

export type ApiStatus = {
  ok: boolean;
  data_source: string;
  data_source_label: string;
  ai: { mode: string; configured: boolean; provider: string; model: string };
  log_transport?: {
    encryption_in_transit: boolean;
    decrypt_at_ingest?: boolean;
    algorithm?: string;
  };
  soc_model?: { role: string; analyst_decides_high_risk?: boolean };
};

export type { AiGovernanceEvent, AiGovernanceMetrics };
