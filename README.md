# ArtBridge — Frontend Client

Next.js 16 · React 19 · Tailwind CSS v4 · TypeScript

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Folder Structure

```
src/
├── app/                        # Next.js App Router pages and layouts
│   ├── globals.css             # Global styles and Tailwind v4 design tokens (@theme)
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
│
├── components/
│   ├── ui/                     # Design system atoms (DS-3 through DS-7)
│   │   └── index.ts            # Barrel export — import from "@/components/ui"
│   │
│   └── common/                 # Composed/shared molecules (DS-8+)
│       └── index.ts            # Barrel export — import from "@/components/common"
│
└── lib/
    └── utils.ts                # Shared utilities (cn() helper)
```

---

## Import Conventions

All TypeScript path aliases are rooted at `src/` via `@/*`:

```ts
// Utilities
import { cn } from "@/lib/utils";

// UI atom components
import { Button, Badge } from "@/components/ui";

// Composed/common components
import { PageHeader, EmptyState } from "@/components/common";
```

> **Rule:** Never import a component by its full path (`../../components/ui/Button`).
> Always use the barrel alias. This keeps refactoring safe and imports readable.

---

## cn() — Class Name Helper

`cn()` lives in `@/lib/utils` and combines `clsx` with `tailwind-merge`.
Use it everywhere instead of raw string concatenation:

```ts
import { cn } from "@/lib/utils";

// Resolves Tailwind conflicts (e.g. p-2 + p-4 → p-4) and handles conditionals
className={cn("base-class", isActive && "bg-primary", className)}
```

---

## Design Tokens

Design tokens are defined as CSS custom properties in `src/app/globals.css` inside the
`@theme` block (Tailwind v4 convention — no `tailwind.config.ts` needed):

```css
@theme {
  --color-primary: var(--primary);
  /* ... */
}
```

See DS-2 (ARTBR-26) for the full token audit and dark mode setup.

