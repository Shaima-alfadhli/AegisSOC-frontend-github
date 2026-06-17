import { AppShell } from "@/components/layout/AppShell";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { UsersWorkspace } from "@/components/users/UsersWorkspace";

export default function Users() {
  return (
    <AppShell>
      <PageTopBar
        titleKey="pages.users.title"
        subtitleKey="pages.users.subtitle"
      />
      <UsersWorkspace />
    </AppShell>
  );
}
