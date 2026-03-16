export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-start justify-center gap-6 px-6 py-16">
      <p className="inline-flex rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
        ArtBridge Design System
      </p>
      <h1 className="text-4xl font-semibold tracking-tight">Frontend Client</h1>
      <p className="max-w-2xl text-base text-muted-foreground">
        DS-2 establishes semantic design tokens and dark mode behavior. Continue
        to the style guide to verify token mapping and visual consistency.
      </p>
      <a
        href="/style-guide"
        className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        Open Style Guide
      </a>
    </main>
  );
}
