import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  [
    "flex min-h-24 w-full rounded-md border bg-background px-3 py-2",
    "text-sm text-foreground",
    "placeholder:text-muted-foreground",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      state: {
        default: "border-input",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-success focus-visible:ring-success",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        both: "resize",
      },
    },
    defaultVariants: {
      state: "default",
      resize: "vertical",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

export type TextareaState = NonNullable<
  VariantProps<typeof textareaVariants>["state"]
>;
export type TextareaResize = NonNullable<
  VariantProps<typeof textareaVariants>["resize"]
>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, state, resize, rows = 4, ...props }, ref) => {
    const isErrorState = state === "error";

    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={props["aria-invalid"] ?? isErrorState}
        data-state={state ?? "default"}
        className={cn(textareaVariants({ state, resize }), className)}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { textareaVariants };
