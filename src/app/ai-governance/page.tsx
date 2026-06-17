import { AiGovernanceMetricCards } from "@/components/ai-governance/AiGovernanceMetricCards";
import { AiGovernanceWorkspace } from "@/components/ai-governance/AiGovernanceWorkspace";
import { AppShell } from "@/components/layout/AppShell";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { api } from "@/lib/api";
import type {
  AiGovernanceEvent,
  AiGovernanceMetrics,
} from "@/lib/types/aiGovernance";

const emptyMetrics: AiGovernanceMetrics = {
  ai_requests_today: 0,
  requests_delta_vs_yesterday: 0,
  blocked_attempts: 0,
  shadow_ai_detected: 0,
  compliance_rate: 0,
  flagged_for_review: 0,
};

export default async function AiGovernancePage() {
  let metrics = emptyMetrics;
  let events: AiGovernanceEvent[] = [];

  try {
    [metrics, events] = await Promise.all([
      api.aiGovernanceMetrics(),
      api.aiGovernanceEvents(),
    ]);
  } catch {
    /* backend route not available */
  }

  return (
    <AppShell>
      <PageTopBar
        titleKey="pages.aiGovernance.title"
        subtitleKey="pages.aiGovernance.subtitle"
      />
      <AiGovernanceMetricCards m={metrics} />
      <AiGovernanceWorkspace events={events} />
    </AppShell>
  );
}
