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
    /**
     * Code variant: inline for `code` element, block for `<pre><code>` block.
     */
    variant?: "inline" | "block";
  };

/**
 * Code component for displaying code snippets (inline or block).
 * Uses monospace font with semantic muted background.
 *
 * @example
 * <Code>const x = 42;</Code>
 * <Code variant="block">{`function example() {\n  return true;\n}`}</Code>
 */
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

/**
 * Pre component wrapper for code blocks (convenience export).
 * Semantically represents preformatted text.
 */
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
