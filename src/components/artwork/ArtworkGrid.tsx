import * as React from "react";
import { cn } from "@/lib/utils";
import { ArtworkCard } from "./ArtworkCard";
import { CardSkeleton } from "@/components/ui";
import { EmptyState } from "@/components/common";
import type { ArtworkResponse } from "@/api";

export interface ArtworkGridProps extends React.HTMLAttributes<HTMLDivElement> {
  artworks: ArtworkResponse[];
  isLoading?: boolean;
  skeletonCount?: number;
  getHref?: (artwork: ArtworkResponse) => string;
  getActions?: (artwork: ArtworkResponse) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyCta?: React.ReactNode;
}

export function ArtworkGrid({
  artworks,
  isLoading = false,
  skeletonCount = 6,
  getHref,
  getActions,
  emptyTitle = "No artworks yet",
  emptyDescription = "Add your first artwork to start building your portfolio.",
  emptyCta,
  className,
  ...props
}: Readonly<ArtworkGridProps>) {
  const gridClass = cn(
    "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    className
  );

  if (isLoading) {
    return (
      <div className={gridClass} {...props}>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        cta={emptyCta}
      />
    );
  }

  return (
    <div className={gridClass} {...props}>
      {artworks.map((artwork) => (
        <ArtworkCard
          key={artwork.id}
          artwork={artwork}
          href={getHref?.(artwork)}
          actions={getActions?.(artwork)}
        />
      ))}
    </div>
  );
}
