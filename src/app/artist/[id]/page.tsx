"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtworkGrid } from "@/components/artwork";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { buttonVariants } from "@/components/ui";
import { listArtworks, ApiError } from "@/api";
import type { ArtworkResponse } from "@/api";

interface ArtistPageProps {
  readonly params: Promise<{ id: string }>;
}

export default function ArtistPage({ params }: Readonly<ArtistPageProps>) {
  const { id } = use(params);
  const [artworks, setArtworks] = useState<ArtworkResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await listArtworks({
          status: "published",
          size: 50,
        });
        if (!cancelled) setArtworks(result.content);
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiError && err.status === 404) {
            setNotFoundError(true);
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (notFoundError) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-start justify-between">
        <PortfolioHeader artist={{ id, name: id }} />
        <Link
          href="/dashboard/artworks/new"
          className={buttonVariants({ size: "sm" })}
        >
          + Add artwork
        </Link>
      </div>
      <ArtworkGrid artworks={artworks} isLoading={isLoading} />
    </main>
  );
}
