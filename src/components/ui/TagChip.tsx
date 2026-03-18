import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tagChipVariants = cva(
  [
    "inline-flex items-center gap-1 rounded-full border border-input bg-background",
    "text-foreground transition-colors",
  ],
  {
    variants: {
      size: {
        sm: "h-6 px-2 text-xs",
        md: "h-8 px-3 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface TagChipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onRemove">,
    VariantProps<typeof tagChipVariants> {
  /** Optional remove callback; when provided, a remove button is rendered. */
  onRemove?: () => void;
  /** Accessible label for remove button. */
  removeLabel?: string;
}

export const TagChip = React.forwardRef<HTMLDivElement, TagChipProps>(
  (
    {
      className,
      size,
      onRemove,
      removeLabel = "Remove tag",
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(tagChipVariants({ size }), className)}
      {...props}
    >
      <span>{children}</span>
      {onRemove ? (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      ) : null}
    </div>
  )
);

TagChip.displayName = "TagChip";

export { tagChipVariants };
