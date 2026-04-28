"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/auth";

export function AuthGuard({ children }: Readonly<{ children: ReactNode }>) {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitializing && isAuthenticated === false) {
      const next = pathname ?? "/dashboard";
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [isAuthenticated, isInitializing, router, pathname]);

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <output
          className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  return <>{children}</>;
}
