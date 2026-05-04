"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
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


export function ImagePreview({
  src,
  alt,
  onRemove,
  aspectRatio = "4/3",
  className,
  ...props
}: Readonly<ImagePreviewProps>) {
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-muted",
        ASPECT_CLASSES[aspectRatio],
        className
      )}
      {...props}
    >
      {hasError ? (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          className="object-cover"
          onError={() => setHasError(true)}
        />
      )}

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
