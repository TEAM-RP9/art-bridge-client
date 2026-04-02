import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const tagChipVariants = cva(
  "inline-flex items-center gap-1 rounded-full border border-input bg-background text-foreground",
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

export type TagChipProps =
  Omit<React.HTMLAttributes<HTMLDivElement>, "onRemove"> &
    VariantProps<typeof tagChipVariants> & {
      onRemove?: () => void;
      removeLabel?: string;
    };

export const TagChip = React.forwardRef<HTMLDivElement, TagChipProps>(
  (
    { className, size, onRemove, removeLabel = "Remove tag", children, ...props },
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
          className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          x
        </button>
      ) : null}
    </div>
  )
);

TagChip.displayName = "TagChip";

export { tagChipVariants };
