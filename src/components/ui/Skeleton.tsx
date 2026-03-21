import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const skeletonVariants = cva("animate-pulse rounded-md bg-muted", {
  variants: {
    shape: {
      line: "h-4 w-full",
      title: "h-5 w-1/2",
      circle: "h-10 w-10 rounded-full",
      block: "h-24 w-full",
    },
  },
  defaultVariants: {
    shape: "line",
  },
});

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof skeletonVariants>;

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, shape, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(skeletonVariants({ shape }), className)}
      {...props}
    />
  )
);

Skeleton.displayName = "Skeleton";

export type CardSkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const CardSkeleton = React.forwardRef<HTMLDivElement, CardSkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border border-border bg-card p-6", className)}
      {...props}
    >
      <Skeleton shape="title" className="mb-4" />
      <Skeleton className="mb-2" />
      <Skeleton className="mb-2 w-3/4" />
      <Skeleton className="w-1/2" />
    </div>
  )
);

CardSkeleton.displayName = "CardSkeleton";

export const StatCardSkeleton = React.forwardRef<HTMLDivElement, CardSkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border border-border bg-card p-5", className)}
      {...props}
    >
      <div className="mb-3 flex items-center justify-between">
        <Skeleton shape="line" className="h-4 w-24" />
        <Skeleton shape="circle" className="h-6 w-6" />
      </div>
      <Skeleton shape="title" className="mb-3 h-8 w-2/5" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
);

StatCardSkeleton.displayName = "StatCardSkeleton";

export const ProgressCardSkeleton = React.forwardRef<
  HTMLDivElement,
  CardSkeletonProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-xl border border-border bg-card p-5", className)}
    {...props}
  >
    <div className="mb-3 flex items-center justify-between">
      <Skeleton shape="line" className="h-4 w-28" />
      <Skeleton shape="line" className="h-4 w-10" />
    </div>
    <Skeleton className="h-2 rounded-full" />
    <Skeleton className="mt-3 h-4 w-2/3" />
  </div>
));

ProgressCardSkeleton.displayName = "ProgressCardSkeleton";

export { skeletonVariants };
