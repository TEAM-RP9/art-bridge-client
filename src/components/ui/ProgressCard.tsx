import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";

const progressToneVariants = cva("h-2 w-full overflow-hidden rounded-full bg-secondary", {
  variants: {
    tone: {
      default: "",
      success: "",
      warning: "",
      destructive: "",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

const progressFillVariants = cva("h-full transition-all", {
  variants: {
    tone: {
      default: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      destructive: "bg-destructive",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

export type ProgressCardProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> &
  VariantProps<typeof progressFillVariants> & {
    title: string;
    value: number;
    description?: React.ReactNode;
    max?: number;
    valueLabel?: string;
  };

export const ProgressCard = React.forwardRef<HTMLDivElement, ProgressCardProps>(
  (
    {
      className,
      title,
      value,
      description,
      tone,
      max = 100,
      valueLabel,
      ...props
    },
    ref
  ) => {
    const safeMax = Math.max(max, 1);
    const safeValue = Math.min(Math.max(value, 0), safeMax);
    const percentage = Math.round((safeValue / safeMax) * 100);

    return (
      <Card ref={ref} className={cn("p-5", className)} {...props}>
        <CardHeader className="mb-3 items-center">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <span className="text-sm font-medium text-card-foreground">
            {valueLabel ?? `${percentage}%`}
          </span>
        </CardHeader>

        <CardContent className="space-y-3">
          <progress
            className="sr-only"
            value={safeValue}
            max={safeMax}
            aria-label={title}
          >
            {percentage}%
          </progress>
          <div
            className={cn(progressToneVariants({ tone }))}
            aria-hidden="true"
          >
            <div
              className={cn(progressFillVariants({ tone }))}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </CardContent>
      </Card>
    );
  }
);

ProgressCard.displayName = "ProgressCard";

export { progressFillVariants, progressToneVariants };
