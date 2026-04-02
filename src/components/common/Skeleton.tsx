import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
}

export function Skeleton({
  width = "100%",
  height = "1rem",
  borderRadius,
  className,
  style,
  ...props
}: Readonly<SkeletonProps>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden bg-muted",
        "before:absolute before:inset-0 before:-translate-x-full before:will-change-transform motion-safe:before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-background/50 before:to-transparent",
        className
      )}
      style={{
        width,
        height,
        borderRadius: borderRadius ?? "0.5rem",
        ...style,
      }}
      {...props}
    />
  );
}
