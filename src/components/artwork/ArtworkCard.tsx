import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";
import type { ArtworkResponse } from "@/api";

export interface ArtworkCardProps extends React.HTMLAttributes<HTMLDivElement> {
  artwork: ArtworkResponse;
  href?: string;
  actions?: React.ReactNode;
}

export function ArtworkCard({
  artwork,
  href,
  actions,
  className,
  ...props
}: Readonly<ArtworkCardProps>) {
  const primaryImage =
    artwork.images.find((img) => img.isPrimary) ?? artwork.images[0];

  const cardContent = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-muted">
        {primaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primaryImage.url}
            alt={artwork.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        <div className="absolute left-2 top-2">
          <Badge
            variant={artwork.status === "published" ? "success" : "default"}
            size="sm"
          >
            {artwork.status === "published" ? "Published" : "Draft"}
          </Badge>
        </div>

        {actions && (
          <div className="absolute right-2 top-2">{actions}</div>
        )}
      </div>

      <div className="p-4">
        <h3 className="truncate text-sm font-semibold text-card-foreground">
          {artwork.title}
        </h3>
        {artwork.medium && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {artwork.medium}
            {artwork.year ? `, ${artwork.year}` : ""}
          </p>
        )}
        {artwork.status === "published" && artwork.viewCount > 0 && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {artwork.viewCount.toLocaleString()}
          </div>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <div
        className={cn(
          "group overflow-hidden rounded-xl border border-border bg-card shadow-sm",
          "transition-shadow hover:shadow-md",
          className
        )}
        {...props}
      >
        <Link
          href={href}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
        >
          {cardContent}
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        className
      )}
      {...props}
    >
      {cardContent}
    </div>
  );
}
