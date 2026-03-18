type TokenRow = {
  label: string;
  chipClass: string;
  textClass: string;
};

const tokenRows: TokenRow[] = [
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

export function Ds2TokenSections() {
  return (
    <section id="ds2" className="space-y-8 scroll-mt-24">
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
    </section>
  );
}
