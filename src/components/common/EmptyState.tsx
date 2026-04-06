import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  iconLabel?: string;
  title: React.ReactNode;
  description: React.ReactNode;
  cta?: React.ReactNode;
}

export function EmptyState({
  icon,
  iconLabel,
  title,
  description,
  cta,
  className,
  ...props
}: Readonly<EmptyStateProps>) {
  return (
    <section
      className={cn(
        "rounded-xl border border-dashed border-border bg-card p-8 text-center",
        className
      )}
      {...props}
    >
      {icon ? (
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
          aria-hidden="true"
        >
          {icon}
        </div>
      ) : null}

      {iconLabel ? <span className="sr-only">{iconLabel}</span> : null}

      <h2 className="text-lg font-semibold text-card-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>

      {cta ? <div className="mt-5 inline-flex items-center">{cta}</div> : null}
    </section>
  );
}
