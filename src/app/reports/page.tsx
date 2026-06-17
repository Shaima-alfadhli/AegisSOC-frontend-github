import { AppShell } from "@/components/layout/AppShell";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { ReportsWorkspace } from "@/components/reports/ReportsWorkspace";

export default function Reports() {
  return (
    <AppShell>
      <PageTopBar
        titleKey="pages.reports.title"
        subtitleKey="pages.reports.subtitle"
      />
      <ReportsWorkspace />
    </AppShell>
  );
}
