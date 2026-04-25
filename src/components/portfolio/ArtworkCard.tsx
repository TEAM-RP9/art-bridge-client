import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { type Artwork, ARTWORK_MEDIUM_LABELS } from "@/types/artwork";
import { cn } from "@/lib/utils";

interface ArtworkCardProps {
  artwork: Artwork;
  onClick?: (artwork: Artwork) => void;
  className?: string;
}

export function ArtworkCard({ artwork, onClick, className }: ArtworkCardProps) {
  return (
    <Card
      className={cn(
        "group cursor-pointer p-0 overflow-hidden transition-shadow hover:shadow-md",
        className
      )}
      onClick={() => onClick?.(artwork)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.(artwork);
      }}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-2 left-2">
          <Badge size="sm">{ARTWORK_MEDIUM_LABELS[artwork.medium]}</Badge>
        </div>
      </div>

      <div className="p-3">
        <p className="truncate text-sm font-medium text-card-foreground">
          {artwork.title}
        </p>
        <p className="text-xs text-muted-foreground">{artwork.year}</p>
      </div>
    </Card>
  );
}
