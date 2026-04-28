"use client";

import { useAuth } from "@/auth";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      {/* Account section */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Account
          </h2>
        </div>
        <div className="divide-y divide-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-xs text-muted-foreground mt-0.5">{user?.email ?? "—"}</p>
            </div>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              Verified
            </span>
          </div>
          <div className="flex items-center justify-between px-6 py-4 opacity-50">
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-xs text-muted-foreground mt-0.5">Change your password</p>
            </div>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              Soon
            </span>
          </div>
        </div>
      </div>

      {/* Preferences section */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card opacity-50">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Preferences
          </h2>
        </div>
        <div className="divide-y divide-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium">Notifications</p>
              <p className="text-xs text-muted-foreground mt-0.5">Email and in-app alerts</p>
            </div>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              Soon
            </span>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium">Public profile URL</p>
              <p className="text-xs text-muted-foreground mt-0.5">Customize your portfolio link</p>
            </div>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
