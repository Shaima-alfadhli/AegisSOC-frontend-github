import { AppShell } from "@/components/layout/AppShell";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { SocAssistantBanner } from "@/components/dashboard/SocAssistantBanner";
import { AiAssistantWorkspace } from "@/components/ai-assistant/AiAssistantWorkspace";

export default function AiAssistant() {
  return (
    <AppShell>
      <PageTopBar
        titleKey="pages.aiAssistant.title"
        subtitleKey="pages.aiAssistant.subtitle"
      />
      <SocAssistantBanner />
      <AiAssistantWorkspace />
    </AppShell>
  );
}
