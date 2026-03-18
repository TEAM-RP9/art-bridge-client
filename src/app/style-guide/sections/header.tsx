type StyleGuideHeaderProps = {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
};

export function StyleGuideHeader({
  isDarkMode,
  onToggleDarkMode,
}: Readonly<StyleGuideHeaderProps>) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Style Guide</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          DS-2 tokens · DS-3 Button · DS-4 Typography · DS-5 Form controls.
        </p>
      </div>

      <button
        type="button"
        onClick={onToggleDarkMode}
        className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        {isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      </button>
    </header>
  );
}
