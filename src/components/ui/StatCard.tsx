import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";

const trendVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", {
  variants: {
    trend: {
      neutral: "bg-secondary text-secondary-foreground",
      up: "bg-success/15 text-success",
      down: "bg-destructive/15 text-destructive",
    },
  },
  defaultVariants: {
    trend: "neutral",
  },
});

export type StatCardProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> &
  VariantProps<typeof trendVariants> & {
    title: string;
    value: React.ReactNode;
    description?: React.ReactNode;
    trendLabel?: string;
    icon?: React.ReactNode;
  };

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    { className, title, value, description, trend, trendLabel, icon, ...props },
    ref
  ) => (
    <Card ref={ref} className={cn("p-5", className)} {...props}>
      <CardHeader className="mb-3 items-center">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon ? <span className="text-muted-foreground">{icon}</span> : null}
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <div className="flex flex-wrap items-center gap-2">
          {trendLabel ? (
            <span className={cn(trendVariants({ trend }))}>{trendLabel}</span>
          ) : null}
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
);

StatCard.displayName = "StatCard";

export { trendVariants as statTrendVariants };
