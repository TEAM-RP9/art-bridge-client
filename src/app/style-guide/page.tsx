"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Code,
  FormField,
  Heading,
  Input,
  Label,
  Paragraph,
  Switch,
  Textarea,
} from "@/components/ui";

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
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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
            DS-2 tokens · DS-3 Button · DS-4 Typography · DS-5 Form controls.
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

      {/* ── DS-4 Typography ───────────────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Heading — levels</h2>
        <div className="mt-4 space-y-4">
          <Heading level="h1">Heading H1 — Large Page Title</Heading>
          <Heading level="h2">Heading H2 — Section Title</Heading>
          <Heading level="h3">Heading H3 — Subsection Title</Heading>
          <Heading level="h4">Heading H4 — Small Title</Heading>
          <Heading level="h5">Heading H5 — Minor Title</Heading>
          <Heading level="h6">Heading H6 — Smallest Title</Heading>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Heading — colors</h2>
        <div className="mt-4 space-y-3">
          <Heading level="h3" color="default">Default color heading</Heading>
          <Heading level="h3" color="muted">Muted color heading</Heading>
          <Heading level="h3" color="accent">Accent color heading</Heading>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Paragraph — sizes & variants</h2>
        <div className="mt-4 space-y-4">
          <div>
            <Paragraph size="sm" color="muted" weight="medium">{"Large (base text):"}</Paragraph>
            <Paragraph size="lg" className="mt-2">
              This is a large paragraph with comfortable reading line-height. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </Paragraph>
          </div>
          <div>
            <Paragraph size="sm" color="muted" weight="medium">{"Base (default):"}</Paragraph>
            <Paragraph size="base" className="mt-2">
              This is base paragraph text, the standard size for body content across the design system.
            </Paragraph>
          </div>
          <div>
            <Paragraph size="sm" color="muted" weight="medium">{"Small:"}</Paragraph>
            <Paragraph size="sm" className="mt-2">
              Small paragraph text ideal for secondary information or captions.
            </Paragraph>
          </div>
          <div>
            <Paragraph size="sm" color="muted" weight="medium">{"Extra small:"}</Paragraph>
            <Paragraph size="xs" className="mt-2">
              Extra small text for minor details or disclaimers.
            </Paragraph>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Paragraph — weights & colors</h2>
        <div className="mt-4 space-y-3">
          <Paragraph weight="normal">Normal weight paragraph text.</Paragraph>
          <Paragraph weight="medium">Medium weight paragraph text.</Paragraph>
          <Paragraph weight="semibold">Semibold weight paragraph text.</Paragraph>
          <Paragraph color="muted">Muted color paragraph text.</Paragraph>
          <Paragraph color="accent">Accent color paragraph text.</Paragraph>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Label — variations</h2>
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="regular">Regular label</Label>
            <input id="regular" type="text" className="mt-2 w-full border border-input rounded px-3 py-2" placeholder="Input..." />
          </div>
          <div>
            <Label htmlFor="required" required>Required label</Label>
            <input id="required" type="text" className="mt-2 w-full border border-input rounded px-3 py-2" placeholder="Input..." />
          </div>
          <div>
            <Label htmlFor="disabled" disabled>Disabled label</Label>
            <input id="disabled" type="text" className="mt-2 w-full border border-input rounded px-3 py-2 text-muted-foreground cursor-not-allowed opacity-50" placeholder="Disabled..." disabled />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Code — inline & block</h2>
        <div className="mt-4 space-y-4">
          <div>
            <Paragraph className="mb-2">Inline code example:</Paragraph>
            <Paragraph>Use <Code>const name = &quot;ArtBridge&quot;;</Code> to define a variable.</Paragraph>
          </div>
          <div>
            <Paragraph className="mb-2">Block code example:</Paragraph>
            <Code variant="block">{`function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return true;
}`}</Code>
          </div>
        </div>
      </section>

      {/* ── DS-5 Form Controls ──────────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Input — states & sizes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input placeholder="Default input" />
          <Input state="success" placeholder="Success input" />
          <Input state="error" placeholder="Error input" aria-invalid />
          <Input size="lg" placeholder="Large input" />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Textarea — states & resize</h2>
        <div className="mt-4 grid gap-4">
          <Textarea placeholder="Vertical resize (default)" />
          <Textarea resize="none" placeholder="Resize disabled" />
          <Textarea state="error" placeholder="Textarea with error state" aria-invalid />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Switch — interactive</h2>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
              aria-label="Enable notifications"
            />
            <Paragraph size="sm">
              Notifications {notificationsEnabled ? "enabled" : "disabled"}
            </Paragraph>
          </div>

          <div className="flex items-center gap-3">
            <Switch size="sm" aria-label="Small switch demo" />
            <Paragraph size="sm" color="muted">
              Small size switch
            </Paragraph>
          </div>

          <div className="flex items-center gap-3">
            <Switch state="error" aria-label="Error state switch demo" />
            <Paragraph size="sm" className="text-destructive">
              Error state
            </Paragraph>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">FormField — composition</h2>
        <div className="mt-4 grid gap-5">
          <FormField
            label="Artwork title"
            htmlFor="artwork-title"
            required
            description="Keep title concise and specific."
          >
            <Input id="artwork-title" placeholder="Moonlight Over Tallinn" />
          </FormField>

          <FormField
            label="Artwork description"
            htmlFor="artwork-description"
            description="Describe medium, concept, and dimensions."
          >
            <Textarea id="artwork-description" placeholder="Describe your artwork..." />
          </FormField>

          <FormField
            label="Artist statement"
            htmlFor="artist-statement"
            error="Statement is required and must be at least 50 characters."
          >
            <Textarea
              id="artist-statement"
              state="error"
              aria-invalid
              placeholder="Write your statement..."
            />
          </FormField>
        </div>
      </section>
    </main>
  );
}
