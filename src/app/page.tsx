import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <span className="text-sm font-semibold">ArtBridge</span>
        <Link
          href="/login"
          className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-transparent px-3 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Log in
        </Link>
      </nav>
    <main className="mx-auto flex w-full max-w-3xl flex-grow flex-col items-start justify-center gap-6 px-6 py-16">
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
        className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground mb-2"
      >
        Open Style Guide
      </a>
      <a
        href="/test"
        className="inline-flex items-center rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-900 mt-2"
      >
        Developer Test Pages
      </a>
    </main>
    </div>
  );
}
