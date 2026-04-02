import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const codeVariants = cva("font-mono", {
  variants: {
    variant: {
      inline: "text-sm bg-muted px-1.5 py-0.5 rounded text-muted-foreground",
      block: "text-sm bg-muted p-4 rounded-lg overflow-x-auto text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "inline",
  },
});

export type CodeProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof codeVariants> & {
    variant?: "inline" | "block";
  };

export const Code = React.forwardRef<HTMLPreElement | HTMLElement, CodeProps>(
  ({ variant = "inline", className, children, ...props }, ref) => {
    if (variant === "block") {
      return (
        <pre
          ref={ref as React.Ref<HTMLPreElement>}
          className={cn(codeVariants({ variant }), className)}
          {...props}
        >
          <code>{children}</code>
        </pre>
      );
    }

    return (
      <code
        ref={ref as React.Ref<HTMLElement>}
        className={cn(codeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);

Code.displayName = "Code";

export const Pre = React.forwardRef<
  HTMLPreElement,
  React.HTMLAttributes<HTMLPreElement>
>(({ className, ...props }, ref) => (
  <pre
    ref={ref}
    className={cn("overflow-x-auto", className)}
    {...props}
  />
));

Pre.displayName = "Pre";
