import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("font-bold", {
  variants: {
    level: {
      h1: "text-4xl md:text-5xl leading-tight",
      h2: "text-3xl md:text-4xl leading-tight",
      h3: "text-2xl md:text-3xl leading-snug",
      h4: "text-xl md:text-2xl leading-snug",
      h5: "text-lg md:text-xl leading-normal",
      h6: "text-base md:text-lg leading-normal",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      accent: "text-accent-foreground",
    },
  },
  defaultVariants: {
    level: "h1",
    color: "default",
  },
});

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingVariants> & {
    /**
     * Semantic heading level (h1-h6).
     * Determines both HTML tag and text size.
     */
    level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  };

/**
 * Heading component for semantic page structure.
 * Renders the appropriate HTML heading tag based on the `level` prop.
 *
 * @example
 * <Heading level="h1">Page Title</Heading>
 * <Heading level="h2" color="muted">Subtitle</Heading>
 */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = "h1", color, className, ...props }, ref) => {
    const Tag = level as React.ElementType;
    return (
      <Tag
        ref={ref}
        className={cn(headingVariants({ level, color }), className)}
        {...props}
      />
    );
  }
);

Heading.displayName = "Heading";
