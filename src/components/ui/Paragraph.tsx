import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const paragraphVariants = cva("", {
  variants: {
    size: {
      base: "text-base leading-7",
      sm: "text-sm leading-6",
      xs: "text-xs leading-5",
      lg: "text-lg leading-8",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      accent: "text-accent-foreground",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
  },
  defaultVariants: {
    size: "base",
    color: "default",
    weight: "normal",
  },
});

export type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof paragraphVariants>;

/**
 * Paragraph component for body text content.
 * Supports multiple sizes, colors, and weights.
 *
 * @example
 * <Paragraph>Regular paragraph text</Paragraph>
 * <Paragraph size="sm" color="muted">Small muted text</Paragraph>
 * <Paragraph size="lg" weight="semibold">Large bold text</Paragraph>
 */
export const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ size, color, weight, className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(paragraphVariants({ size, color, weight }), className)}
      {...props}
    />
  )
);

Paragraph.displayName = "Paragraph";
