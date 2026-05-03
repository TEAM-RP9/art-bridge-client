"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ArtworkGrid } from "@/components/artwork";
import { listArtworks } from "@/api";
import type { ArtworkResponse, ArtworkStatus } from "@/api";

const STATUS_TABS: { label: string; value: ArtworkStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Published", value: "published" },
  { label: "Drafts", value: "draft" },
];

const PAGE_SIZE = 24;

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState<ArtworkResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState<ArtworkStatus | "all">("all");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchArtworks = useCallback(
    async (status: ArtworkStatus | "all", page: number, append: boolean) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      try {
        const result = await listArtworks({
          status: status === "all" ? undefined : status,
          size: PAGE_SIZE,
          page,
        });
        setArtworks((prev) =>
          append ? [...prev, ...(result?.content ?? [])] : (result?.content ?? [])
        );
        setTotalPages(result?.totalPages ?? 1);
        setCurrentPage(page);
      } catch {
        setError("Failed to load artworks. Please try again.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    setCurrentPage(0);
    fetchArtworks(activeTab, 0, false);
  }, [activeTab, fetchArtworks]);

  const handleTabChange = (tab: ArtworkStatus | "all") => {
    if (tab !== activeTab) setActiveTab(tab);
  };

  const handleLoadMore = () => {
    fetchArtworks(activeTab, currentPage + 1, true);
  };

  const hasMore = currentPage < totalPages - 1;

  const artworkCountText = `${artworks.length} artwork${artworks.length === 1 ? "" : "s"}`;

  const getEmptyDescription = () => {
    if (activeTab === "draft") return "You have no saved drafts.";
    if (activeTab === "published") return "You have no published artworks yet.";
    return "Add your first artwork to start building your portfolio.";
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Artworks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? "Loading..." : artworkCountText}
          </p>
        </div>
        <Link href="/dashboard/artworks/new">
          <Button>+ Add Artwork</Button>
        </Link>
      </div>

      <div className="mb-6 flex w-fit gap-1 rounded-lg border border-border bg-muted p-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleTabChange(tab.value)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-card text-card-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchArtworks(activeTab, 0, false)}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      <ArtworkGrid
        artworks={artworks}
        isLoading={isLoading}
        getHref={(artwork) => `/dashboard/artworks/${artwork.id}`}
        emptyTitle="No artworks yet"
        emptyDescription={getEmptyDescription()}
        emptyCta={
          <Link href="/dashboard/artworks/new">
            <Button>+ Add Your First Artwork</Button>
          </Link>
        }
      />

      {!isLoading && hasMore && (
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}
