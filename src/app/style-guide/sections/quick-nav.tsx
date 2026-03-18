const navItems = [
  { id: "ds2", label: "DS-2 Tokens" },
  { id: "ds3", label: "DS-3 Buttons" },
  { id: "ds4", label: "DS-4 Typography" },
  { id: "ds5", label: "DS-5 Forms" },
  { id: "ds6", label: "DS-6 Badge & TagChip" },
];

export function StyleGuideQuickNav() {
  return (
    <nav className="sticky top-3 z-10 rounded-xl border border-border bg-card/90 p-3 backdrop-blur">
      <ul className="flex flex-wrap items-center gap-2">
        {navItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
