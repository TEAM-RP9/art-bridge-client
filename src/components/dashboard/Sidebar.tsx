"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth";
import { logout } from "@/api";

// ── Nav items ─────────────────────────────────────────────────────────────────

const NAV_PRIMARY = [
  {
    href: "/dashboard/artworks",
    label: "Artworks",
    soon: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    href: "/dashboard/portfolio",
    label: "Portfolio",
    soon: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    soon: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/messages",
    label: "Messages",
    soon: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

const NAV_SECONDARY = [
  {
    href: "/dashboard/notifications",
    label: "Notifications",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const ARTIST_ONLY_NAV_HREFS = new Set([
  "/dashboard/portfolio",
  "/dashboard/analytics",
]);

// ── Nav item component ────────────────────────────────────────────────────────

function NavItem({
  href, label, icon, soon = false, collapsed = false,
}: {
  href: string; label: string; icon: React.ReactNode; soon?: boolean; collapsed?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  if (soon) {
    return (
      <div className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground/60 cursor-default select-none",
        collapsed && "justify-center px-2"
      )}>
        {icon}
        {!collapsed && (
          <>
            <span className="flex-1">{label}</span>
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium leading-none">
              soon
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      {icon}
      {!collapsed && label}
    </Link>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export function Sidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const isArtist = user?.role === "ARTIST";
  const primaryNav = NAV_PRIMARY.filter((item) => isArtist || !ARTIST_ONLY_NAV_HREFS.has(item.href));

  const handleLogout = async () => {
    try { await logout(); } catch { /* ignore */ }
    router.push("/login");
  };

  const initials = (user?.email ?? "A")
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-foreground"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-base font-semibold tracking-tight">ArtBridge</span>
      </div>

      {/* Add artwork CTA */}
      {isArtist && (
        <div className="p-3">
          <Link
            href="/dashboard/artworks/new"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Artwork
          </Link>
        </div>
      )}

      {/* Primary nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {primaryNav.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}

        <div className="my-2 border-t border-border" />

        {NAV_SECONDARY.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      {/* User + logout */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">
              {user?.email ?? "Artist"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="text-muted-foreground transition-colors hover:text-destructive"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

// ── Mobile bottom nav ─────────────────────────────────────────────────────────

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isArtist = user?.role === "ARTIST";

  const items = [
    { href: "/dashboard/artworks", label: "Artworks", icon: NAV_PRIMARY[0].icon },
    { href: "/dashboard/portfolio", label: "Portfolio", icon: NAV_PRIMARY[1].icon, artistOnly: true },
    { href: "/dashboard/artworks/new", label: "Add", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ), artistOnly: true },
    { href: "/dashboard/analytics", label: "Analytics", icon: NAV_PRIMARY[2].icon, artistOnly: true },
    { href: "/dashboard/settings", label: "Settings", icon: NAV_SECONDARY[1].icon },
  ].filter((item) => isArtist || !item.artistOnly);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center border-t border-border bg-card lg:hidden">
      {items.map((item) => {
        const isAdd = item.label === "Add";
        const isActive = !isAdd && (pathname === item.href || pathname.startsWith(item.href + "/"));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
              isAdd
                ? "text-primary"
                : isActive
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <span className={cn(isAdd && "flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground")}>
              {item.icon}
            </span>
            {!isAdd && item.label}
          </Link>
        );
      })}
    </nav>
  );
}
