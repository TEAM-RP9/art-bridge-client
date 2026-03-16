"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";

const tokenRows = [
  {
    label: "Background",
    chipClass: "bg-background text-foreground border border-border",
    textClass: "text-foreground",
  },
  {
    label: "Card",
    chipClass: "bg-card text-card-foreground border border-border",
    textClass: "text-card-foreground",
  },
  {
    label: "Primary",
    chipClass: "bg-primary text-primary-foreground",
    textClass: "text-primary",
  },
  {
    label: "Secondary",
    chipClass: "bg-secondary text-secondary-foreground",
    textClass: "text-secondary-foreground",
  },
  {
    label: "Muted",
    chipClass: "bg-muted text-muted-foreground border border-border",
    textClass: "text-muted-foreground",
  },
  {
    label: "Accent",
    chipClass: "bg-accent text-accent-foreground",
    textClass: "text-accent-foreground",
  },
  {
    label: "Destructive",
    chipClass: "bg-destructive text-destructive-foreground",
    textClass: "text-destructive",
  },
  {
    label: "Success",
    chipClass: "bg-success text-success-foreground",
    textClass: "text-success",
  },
  {
    label: "Warning",
    chipClass: "bg-warning text-warning-foreground",
    textClass: "text-warning",
  },
  {
    label: "Info",
    chipClass: "bg-info text-info-foreground",
    textClass: "text-info",
  },
];

export default function StyleGuidePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.documentElement.classList.toggle("light", !isDarkMode);

    return () => {
      document.documentElement.classList.remove("dark", "light");
    };
  }, [isDarkMode]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Style Guide</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            DS-2 tokens · DS-3 Button component reference.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDarkMode((previous) => !previous)}
          className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        </button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tokenRows.map((token) => (
          <article
            key={token.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <h2 className="text-sm font-semibold text-card-foreground">
              {token.label}
            </h2>
            <div
              className={`mt-3 flex h-20 items-center justify-center rounded-lg text-sm font-medium ${token.chipClass}`}
            >
              {token.label}
            </div>
            <p className={`mt-3 text-xs ${token.textClass}`}>
              Sample text using semantic token classes.
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Radius Scale</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="rounded-sm bg-secondary p-3 text-xs text-secondary-foreground">
            rounded-sm
          </div>
          <div className="rounded-md bg-secondary p-3 text-xs text-secondary-foreground">
            rounded-md
          </div>
          <div className="rounded-lg bg-secondary p-3 text-xs text-secondary-foreground">
            rounded-lg
          </div>
          <div className="rounded-xl bg-secondary p-3 text-xs text-secondary-foreground">
            rounded-xl
          </div>
        </div>
      </section>

      {/* ── DS-3 Button ───────────────────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Button — variants</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Button — sizes</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Button — states</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>Outline disabled</Button>
        </div>
      </section>
    </main>
  );
}
