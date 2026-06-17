export type AiEventAction = "Allowed" | "Blocked" | "Flagged";
export type AiEventSeverity = "Critical" | "High" | "Medium" | "Low";
export type AiDataCategory =
  | "PII"
  | "Financial"
  | "PCI"
  | "Credentials"
  | "Internal"
  | "Public"
  | "Shadow AI";

export type AiGovernanceEvent = {
  id: string;
  user: string;
  department: string;
  tool: string;
  action: AiEventAction;
  severity: AiEventSeverity;
  data_category: AiDataCategory;
  risk_score: number;
  minutes_ago: number;
  policy_id: string;
  policy_name: string;
  prompt_preview: string;
  dlp_rule?: string;
  status: "Open" | "Under Review" | "Resolved";
};

export type AiGovernanceMetrics = {
  ai_requests_today: number;
  requests_delta_vs_yesterday: number;
  blocked_attempts: number;
  shadow_ai_detected: number;
  compliance_rate: number;
  flagged_for_review: number;
};
