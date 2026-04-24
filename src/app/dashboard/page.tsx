"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth";
import { PageHeader } from "@/components/common";
import LogoutButton from "@/components/auth/LogoutButton";

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/login?next=/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <main className="p-6">
      <PageHeader title="Dashboard" actions={<LogoutButton />} />
    </main>
  );
}