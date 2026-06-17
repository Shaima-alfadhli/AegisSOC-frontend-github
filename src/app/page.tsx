import { AppShell } from "@/components/layout/AppShell";
import { LogTransportBadge } from "@/components/shared/LogTransportBadge";
import { SocAssistantBanner } from "@/components/dashboard/SocAssistantBanner";
import { TopBar } from "@/components/layout/TopBar";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { ThreatActivityChart } from "@/components/dashboard/ThreatActivityChart";
import { AiCopilotPanel } from "@/components/ai-assistant/AiCopilotPanel";
import { IncidentsTable } from "@/components/incidents/IncidentsTable";
import { LiveActivityFeed } from "@/components/dashboard/LiveActivityFeed";
import { fetchDashboardData } from "@/lib/fetchDashboard";

export default function Home() {
  return <Dashboard />;
}

async function Dashboard() {
  const { metrics, points, incidents, activity } = await fetchDashboardData();

  return (
    <AppShell>
      <TopBar />

      <section className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-12 md:gap-5">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-8">
          <MetricCards m={metrics} />
          <ThreatActivityChart points={points} />
        </div>
        <aside className="flex min-w-0 flex-col gap-3 md:col-span-4 md:self-stretch">
          <SocAssistantBanner className="flex-1" />
          <LogTransportBadge />
        </aside>
      </section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:items-start">
        <div className="min-w-0 md:col-span-8">
          <IncidentsTable incidents={incidents} />
        </div>
        <div className="flex min-w-0 flex-col gap-5 md:col-span-4">
          <AiCopilotPanel incidents={incidents} />
          <LiveActivityFeed items={activity} />
        </div>
      </div>
    </AppShell>
  );
}
