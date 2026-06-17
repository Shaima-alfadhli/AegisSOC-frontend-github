import { AppShell } from "@/components/layout/AppShell";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { IncidentSummaryCards } from "@/components/incidents/IncidentSummaryCards";
import { IncidentsWorkspace } from "@/components/incidents/IncidentsWorkspace";
import { fetchIncidents } from "@/lib/fetchDashboard";

export default async function Incidents() {
  const { incidents } = await fetchIncidents();

  return (
    <AppShell>
      <PageTopBar
        titleKey="pages.incidents.title"
        subtitleKey="pages.incidents.subtitle"
      />

      <IncidentSummaryCards incidents={incidents} />

      <IncidentsWorkspace incidents={incidents} />
    </AppShell>
  );
}
