"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PublicNav } from "@/components/common";
import { MOCK_DISCOVER_ARTWORKS } from "../page";
import type { PublicArtwork } from "../page";
import { CATEGORY_LABELS } from "@/lib/constants";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ArtworkDetailPageProps {
  readonly params: Promise<{ id: string }>;
}

// ── Icons ──────────────────────────────────────────────────────────────────────

function BackArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function HeartIcon({ filled }: Readonly<{ filled?: boolean }>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function MetaItem({
  label,
  value,
  icon,
}: Readonly<{ label: string; value: string; icon: React.ReactNode }>) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function SmallArtworkCard({ artwork }: Readonly<{ artwork: PublicArtwork }>) {
  const image = artwork.images.find((i) => i.isPrimary) ?? artwork.images[0];
  return (
    <Link
      href={`/discover/${artwork.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-medium text-card-foreground">{artwork.title}</p>
        {artwork.year && <p className="text-xs text-muted-foreground">{artwork.year}</p>}
      </div>
    </Link>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  const { id } = use(params);

  const artwork = MOCK_DISCOVER_ARTWORKS.find((a) => a.id === id);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(artwork?.likeCount ?? 0);

  if (!artwork) notFound();

  const image = artwork.images.find((i) => i.isPrimary) ?? artwork.images[0];
  const moreFromArtist = MOCK_DISCOVER_ARTWORKS.filter(
    (a) => a.artist.id === artwork.artist.id && a.id !== artwork.id
  );

  const handleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      /* clipboard not available */
    }
  };

  const dimensionLabel =
    artwork.width && artwork.height
      ? `${artwork.width}${artwork.unit ?? ""} × ${artwork.height}${artwork.unit ?? ""}`
      : null;

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Back link */}
        <Link
          href="/discover"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <BackArrowIcon />
          Back to Discover
        </Link>

        {/* Main layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
          {/* Image */}
          <div className="overflow-hidden rounded-2xl border border-border bg-muted">
            {image ? (
              <Image
                src={image.url}
                alt={artwork.title}
                width={image.width}
                height={image.height}
                className="h-full max-h-[600px] w-full object-contain"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
          </div>

          {/* Details panel */}
          <div className="flex flex-col gap-5">
            {/* Title + artist */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">{artwork.title}</h1>
              <Link
                href={`/artist/${artwork.artist.id}`}
                className="mt-1 inline-block text-sm text-primary hover:underline"
              >
                {artwork.artist.name}
              </Link>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleLike}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  liked
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                <HeartIcon filled={liked} />
                {liked ? "Liked" : "Like"}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <ShareIcon />
                Share
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <HeartIcon />
                {likeCount.toLocaleString()} likes
              </span>
              <span className="flex items-center gap-1.5">
                <EyeIcon />
                {artwork.viewCount.toLocaleString()} views
              </span>
            </div>

            <div className="border-t border-border" />

            {/* Description */}
            {artwork.description && (
              <>
                <div>
                  <p className="mb-2 text-sm font-semibold text-foreground">About this artwork</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{artwork.description}</p>
                </div>
                <div className="border-t border-border" />
              </>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              {artwork.year && (
                <MetaItem
                  label="Year"
                  value={String(artwork.year)}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  }
                />
              )}
              {artwork.medium && (
                <MetaItem
                  label="Medium"
                  value={artwork.medium}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  }
                />
              )}
              {dimensionLabel && (
                <MetaItem
                  label="Dimensions"
                  value={dimensionLabel}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  }
                />
              )}
              {artwork.category && (
                <MetaItem
                  label="Category"
                  value={CATEGORY_LABELS[artwork.category] ?? artwork.category}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  }
                />
              )}
            </div>

            {/* Tags */}
            {artwork.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="border-t border-border" />

            {/* Artist card */}
            <Link
              href={`/artist/${artwork.artist.id}`}
              className="group block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {artwork.artist.avatarUrl ? (
                    <Image
                      src={artwork.artist.avatarUrl}
                      alt={artwork.artist.name}
                      width={40}
                      height={40}
                      className="shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                      {artwork.artist.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-card-foreground transition-colors group-hover:text-primary">
                      {artwork.artist.name}
                    </p>
                    {artwork.artist.location && (
                      <p className="text-xs text-muted-foreground">{artwork.artist.location}</p>
                    )}
                  </div>
                </div>
                <ExternalLinkIcon />
              </div>

              {artwork.artist.bio && (
                <p className="mt-3 text-sm text-muted-foreground">{artwork.artist.bio}</p>
              )}

              <p className="mt-2 text-xs text-muted-foreground">
                {artwork.artist.worksCount} artworks · View portfolio
              </p>
            </Link>
          </div>
        </div>

        {/* More from artist */}
        {moreFromArtist.length > 0 && (
          <div className="mt-14">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                More from {artwork.artist.name}
              </h2>
              <Link
                href={`/artist/${artwork.artist.id}`}
                className="text-sm text-primary hover:underline"
              >
                View full portfolio →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {moreFromArtist.slice(0, 4).map((a) => (
                <SmallArtworkCard key={a.id} artwork={a} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
