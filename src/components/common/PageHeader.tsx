import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  titleLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function PageHeader({
  title,
  subtitle,
  actions,
  className,
  titleLevel = "h1",
  ...props
}: Readonly<PageHeaderProps>) {
  const HeadingTag = titleLevel;

  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        <HeadingTag className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </HeadingTag>
        {subtitle ? (
          <p className="text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        ) : null}
      </div>

      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}
