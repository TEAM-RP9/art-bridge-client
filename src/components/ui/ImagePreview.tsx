"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ImagePreviewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  onRemove?: () => void;
  aspectRatio?: "1/1" | "4/3" | "16/9" | "3/4";
}

const ASPECT_CLASSES: Record<NonNullable<ImagePreviewProps["aspectRatio"]>, string> = {
  "1/1": "aspect-square",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-video",
  "3/4": "aspect-[3/4]",
};

const FALLBACK_SVG =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTIxIDE5VjVhMiAyIDAgMCAwLTItMkg1YTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmgxNGEyIDIgMCAwIDAgMi0yem0tMTIuNS04LjVhMS41IDEuNSAwIDEgMSAzIDAgMS41IDEuNSAwIDAgMS0zIDB6TTIxIDE5bC01LTUtNCA0LTMtMy02IDZoMThWMTl6IiBmaWxsPSIjY2NjIi8+PC9zdmc+";

export function ImagePreview({
  src,
  alt,
  onRemove,
  aspectRatio = "4/3",
  className,
  ...props
}: Readonly<ImagePreviewProps>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-muted",
        ASPECT_CLASSES[aspectRatio],
        className
      )}
      {...props}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = FALLBACK_SVG;
        }}
      />

      {onRemove && (
        <button
          type="button"
          aria-label="Remove image"
          onClick={onRemove}
          className={cn(
            "absolute right-2 top-2",
            "flex h-8 w-8 items-center justify-center rounded-full",
            "bg-background/80 backdrop-blur-sm border border-border",
            "text-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
