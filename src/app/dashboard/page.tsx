import { redirect } from "next/navigation";
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth";
import { PageHeader } from "@/components/common";
import LogoutButton from "@/components/auth/LogoutButton";
import { Button } from "@/components/ui";

export default function DashboardPage() {
  redirect("/dashboard/artworks");
}

  return (
    <main className="p-6">
      <PageHeader
        title="Dashboard"
        actions={
          <>
            <Button asChild>
              <Link href="/dashboard/artwork/new">Add Artwork</Link>
            </Button>
            <LogoutButton />
          </>
        }
      />
    </main>
  );
}