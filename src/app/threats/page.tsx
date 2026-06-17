import { AppShell } from "@/components/layout/AppShell";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { ThreatSummaryCards } from "@/components/threats/ThreatSummaryCards";
import { ThreatActivityChart } from "@/components/dashboard/ThreatActivityChart";
import { AiThreatIntelligence } from "@/components/dashboard/AiThreatIntelligence";
import { ThreatsTable } from "@/components/threats/ThreatsTable";
import { ThreatLiveFeed } from "@/components/threats/ThreatLiveFeed";
import { fetchThreatsPageData } from "@/lib/fetchDashboard";

export default async function Threats() {
  const { metrics, points, incidents, activity } = await fetchThreatsPageData();
  const peakAlerts = points.length ? Math.max(...points.map((p) => p.alerts), 0) : 0;

  return (
    <AppShell>
      <PageTopBar
        titleKey="pages.threats.title"
        subtitleKey="pages.threats.subtitle"
      />

      <ThreatSummaryCards m={metrics} peakAlerts={peakAlerts} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-stretch">
        <div className="min-w-0 lg:col-span-8">
          <ThreatActivityChart
            points={points}
            titleKey="pages.threats.timelineTitle"
            subtitleKey="pages.threats.timelineSub"
          />
        </div>
        <div className="min-w-0 lg:col-span-4">
          <AiThreatIntelligence />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-stretch">
        <div className="min-w-0 lg:col-span-8">
          <ThreatsTable rows={incidents} />
        </div>
        <div className="min-w-0 lg:col-span-4">
          <ThreatLiveFeed items={activity} />
        </div>
      </div>
    </AppShell>
  );
}
