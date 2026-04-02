import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva("text-sm font-medium leading-none", {
  variants: {
    required: {
      true: "after:content-['*'] after:ml-1 after:text-destructive",
      false: "",
    },
    disabled: {
      true: "text-muted-foreground cursor-not-allowed",
      false: "",
    },
  },
  defaultVariants: {
    required: false,
    disabled: false,
  },
});

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> &
  VariantProps<typeof labelVariants> & {
    /**
     * Show asterisk and mark as required.
     */
    required?: boolean;
  };

/**
 * Label component for form inputs.
 * Includes optional required indicator and disabled state.
 *
 * @example
 * <Label htmlFor="email">Email</Label>
 * <Label htmlFor="password" required>Password</Label>
 * <Label htmlFor="disabled-field" disabled>Disabled Field</Label>
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ required, disabled, className, htmlFor, ...props }, ref) => (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cn(labelVariants({ required, disabled }), className)}
      {...props}
    />
  )
);

Label.displayName = "Label";
