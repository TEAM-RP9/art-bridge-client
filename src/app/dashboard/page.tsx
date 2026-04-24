import { PageHeader } from "@/components/common";
import LogoutButton from "@/components/auth/LogoutButton";

export default function DashboardPage() {
  return (
    <main className="p-6">
      <PageHeader title="Dashboard" actions={<LogoutButton />} />
    </main>
  );
}