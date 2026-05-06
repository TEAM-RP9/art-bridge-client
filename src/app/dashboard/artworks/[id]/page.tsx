"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge, Button } from "@/components/ui";
import { getArtwork, deleteArtwork, ApiError } from "@/api";
import type { ArtworkResponse } from "@/api";

interface ArtworkDetailPageProps {
  readonly params: Promise<{ id: string }>;
}

export default function ArtworkDetailPage({ params }: Readonly<ArtworkDetailPageProps>) {
  const { id } = use(params);
  const router = useRouter();
  const [artwork, setArtwork] = useState<ArtworkResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getArtwork(id)
      .then((data) => { if (!cancelled) setArtwork(data); })
      .catch((err) => {
        if (!cancelled && err instanceof ApiError) {
          if (err.status === 404) {
            setNotFoundError(true);
          } else if (err.status === 403) {
            router.replace("/dashboard/artworks");
          }
        }
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [id, router]);

  if (notFoundError) notFound();

  const handleDelete = async () => {
    if (!confirm("Delete this artwork? This cannot be undone.")) return;
    setIsDeleting(true);
    try {
      await deleteArtwork(id);
      router.push("/dashboard/artworks");
    } catch {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="aspect-[4/3] w-full rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!artwork) return null;

  const primaryImage =
    artwork.images.find((img) => img.isPrimary) ?? artwork.images[0];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Breadcrumb + actions */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard/artworks"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← My Artworks
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/artworks/${id}/edit`}>
            <Button variant="outline" size="sm">Edit</Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={artwork.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant={artwork.status === "published" ? "success" : "default"}>
                {artwork.status === "published" ? "Published" : "Draft"}
              </Badge>
              {artwork.category && (
                <Badge variant="info">{artwork.category}</Badge>
              )}
            </div>
            <h1 className="text-2xl font-semibold">{artwork.title}</h1>
            {artwork.medium && (
              <p className="mt-1 text-sm text-muted-foreground">
                {artwork.medium}
                {artwork.creationYear ? `, ${artwork.creationYear}` : ""}
              </p>
            )}
          </div>

          {artwork.description && (
            <p className="text-sm text-foreground leading-relaxed">
              {artwork.description}
            </p>
          )}

          {(artwork.width || artwork.height) && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                Dimensions
              </p>
              <p className="text-sm">
                {artwork.width} × {artwork.height} {artwork.dimensionUnit}
              </p>
            </div>
          )}

          {artwork.tags.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {artwork.status === "published" && artwork.viewCount > 0 && (
            <div className="border-t border-border pt-4 text-sm text-muted-foreground">
              {artwork.viewCount.toLocaleString()} views
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
