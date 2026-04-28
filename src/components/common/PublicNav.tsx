"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/api";
import { useAuth } from "@/auth";

export function PublicNav() {
  const { user, isAuthenticated, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try { await logout(); } catch { /* ignore */ }
    signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-base font-semibold text-foreground hover:text-primary transition-colors">
          ArtBridge
        </Link>

        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden text-xs text-muted-foreground sm:block">{user?.email}</span>
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
