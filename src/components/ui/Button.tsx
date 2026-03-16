import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ─── Variant definitions ────────────────────────────────────────────────────

const buttonVariants = cva(
  // Base styles applied to every button
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap rounded-md font-medium",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        /** Primary action — uses the brand colour */
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        /** Softer secondary action */
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        /** Minimal — no background, inherits surface */
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        /** Bordered, transparent background */
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        /** Destructive / danger action */
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        /** Looks like a hyperlink */
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        /** Square icon-only button — combine with an icon child */
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// ─── Types ───────────────────────────────────────────────────────────────────

export type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;
export type ButtonSize = NonNullable<
  VariantProps<typeof buttonVariants>["size"]
>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Renders a spinner and disables interaction while true */
  isLoading?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Button({
  className,
  variant,
  size,
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled ?? isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export { buttonVariants };
