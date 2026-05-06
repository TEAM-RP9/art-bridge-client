"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { listArtistArtworks, ApiError } from "@/api";
import type { ArtworkResponse } from "@/api";
import { PublicNav } from "@/components/common";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ArtistData {
  id: string;
  name: string;
  bio?: string;
  location?: string;
  website?: string;
  avatarUrl?: string;
}

interface ArtistPageProps {
  readonly params: Promise<{ id: string }>;
}

// ── Mock artist profiles (replace with GET /artists/:id when backend ready) ───

const MOCK_ARTISTS: Record<string, Omit<ArtistData, "id">> = {
  "1": {
    name: "Sofia Anderson",
    bio: "Contemporary artist exploring themes of nature, identity, and memory through expressive figurative work.",
    location: "Tallinn, Estonia",
    website: "https://sofia.art",
  },
};

function getMockArtist(id: string): ArtistData {
  const known = MOCK_ARTISTS[id];
  if (known) return { id, ...known };
  return { id, name: `Artist ${id}`, bio: "Artist sharing their work on ArtBridge.", location: "Estonia" };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ArtistAvatar({ artist }: Readonly<{ artist: ArtistData }>) {
  if (artist.avatarUrl) {
    return (
      <Image
        src={artist.avatarUrl}
        alt={artist.name}
        width={96}
        height={96}
        className="shrink-0 rounded-full object-cover ring-4 ring-background shadow-lg"
      />
    );
  }
  return (
    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground ring-4 ring-background shadow-lg">
      {artist.name.charAt(0).toUpperCase()}
    </div>
  );
}

function StatBlock({ value, label }: Readonly<{ value: string; label: string }>) {
  return (
    <div>
      <p className="text-base font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function PublicArtworkCard({ artwork }: Readonly<{ artwork: ArtworkResponse }>) {
  const image = artwork.images.find((i) => i.isPrimary) ?? artwork.images[0];
  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image.url}
            alt={artwork.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="truncate text-sm font-semibold text-card-foreground">{artwork.title}</h3>
        {artwork.medium && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {artwork.medium}{artwork.year ? `, ${artwork.year}` : ""}
          </p>
        )}
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {artwork.viewCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {artwork.likeCount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function EmptyArtworks({ category }: Readonly<{ category: string }>) {
  const message =
    category === "all"
      ? "This artist hasn't published any works yet."
      : `No works in "${category.replace("-", " ")}" yet.`;
  return (
    <div className="py-20 text-center">
      <p className="text-base font-medium text-foreground">No artworks yet</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

function ArtworkSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-border bg-card">
      <div className="aspect-[4/3] bg-muted" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ArtistPage({ params }: ArtistPageProps) {
  const { id } = use(params);
  const [artworks, setArtworks] = useState<ArtworkResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const artist = getMockArtist(id);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const result = await listArtistArtworks(id, { size: 50 });
        if (!cancelled) setArtworks(result?.content ?? []);
      } catch (err) {
        if (!cancelled && err instanceof ApiError && err.status === 404) {
          setNotFoundError(true);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (notFoundError) notFound();

  const categories = [
    "all",
    ...Array.from(new Set(artworks.map((a) => a.category).filter(Boolean))),
  ];
  const filtered =
    activeCategory === "all"
      ? artworks
      : artworks.filter((a) => a.category === activeCategory);
  const totalViews = artworks.reduce((sum, a) => sum + a.viewCount, 0);
  const totalLikes = artworks.reduce((sum, a) => sum + a.likeCount, 0);

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main>

      {/* ── Artist hero ──────────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <ArtistAvatar artist={artist} />

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-foreground">{artist.name}</h1>

              {artist.location && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {artist.location}
                </p>
              )}

              {artist.bio && (
                <p className="mt-2 max-w-lg text-sm text-foreground">{artist.bio}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-6">
                <StatBlock value={String(artworks.length)} label="Works" />
                <StatBlock value={totalViews.toLocaleString()} label="Total views" />
                <StatBlock value={totalLikes.toLocaleString()} label="Total likes" />
                {artist.website && (
                  <a
                    href={artist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {artist.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Category filter ──────────────────────────────────────────────────── */}
      {!isLoading && categories.length > 1 && (
        <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto max-w-5xl px-4">
            <div className="flex gap-2 overflow-x-auto py-3 [&::-webkit-scrollbar]:hidden">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {cat === "all" ? "All works" : cat.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Artwork grid ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => <ArtworkSkeleton key={i} />)}
          </div>
        )}
        {!isLoading && filtered.length === 0 && (
          <EmptyArtworks category={activeCategory} />
        )}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((artwork) => (
              <PublicArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        )}
      </div>
      </main>
    </div>
  );
}
