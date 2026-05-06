"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, FormField, Input, Textarea } from "@/components/ui";
import { useAuth } from "@/auth";
import { listArtworks, updateArtwork } from "@/api";
import type { ArtworkResponse } from "@/api";

interface ArtistProfile {
  name: string;
  bio: string;
  location: string;
  website: string;
}

const DEFAULT_PROFILE: ArtistProfile = {
  name: "Sofia Anderson",
  bio: "Contemporary artist exploring themes of nature, identity, and memory through expressive figurative work.",
  location: "Tallinn, Estonia",
  website: "https://sofia.art",
};

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

// ── Public portfolio preview ──────────────────────────────────────────────────

function PortfolioPreview({
  profile,
  artworks,
  isLoading,
}: Readonly<{
  profile: ArtistProfile;
  artworks: ArtworkResponse[];
  isLoading: boolean;
}>) {
  const [activeCategory, setActiveCategory] = useState("all");

  const initials = profile.name
    .split(" ")
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

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
    <div className="-mx-6 -mt-10 rounded-xl overflow-hidden border border-border bg-background">
      {/* Artist hero — mirrors public artist page */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground ring-4 ring-background shadow-lg">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
              {profile.location && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profile.location}
                </p>
              )}
              {profile.bio && (
                <p className="mt-2 max-w-lg text-sm text-foreground">{profile.bio}</p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-base font-semibold text-foreground">{artworks.length}</p>
                  <p className="text-xs text-muted-foreground">Works</p>
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">{totalViews.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total views</p>
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">{totalLikes.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total likes</p>
                </div>
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {profile.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      {!isLoading && categories.length > 1 && (
        <div className="border-b border-border bg-background">
          <div className="px-6">
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

      {/* Artwork grid */}
      <div className="px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`sk-${i}`} className="animate-pulse overflow-hidden rounded-xl border border-border bg-card">
                <div className="aspect-[4/3] bg-muted" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-medium text-foreground">No artworks yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Switch to Edit to add artworks.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((artwork) => {
              const img = artwork.images.find((i) => i.isPrimary) ?? artwork.images[0];
              return (
                <Link key={artwork.id} href={`/dashboard/artworks/${artwork.id}`} className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {img ? (
                      <Image
                        src={img.url}
                        alt={artwork.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
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
                        {artwork.medium}{artwork.creationYear ? `, ${artwork.creationYear}` : ""}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Portfolio management (edit mode) ──────────────────────────────────────────

function PortfolioEdit({
  profile,
  onProfileSave,
  visible,
  hidden,
  isLoading,
  onMove,
  onToggle,
  togglingId,
}: Readonly<{
  profile: ArtistProfile;
  onProfileSave: (p: ArtistProfile) => void;
  visible: ArtworkResponse[];
  hidden: ArtworkResponse[];
  isLoading: boolean;
  onMove: (i: number, dir: -1 | 1) => void;
  onToggle: (a: ArtworkResponse) => void;
  togglingId: string | null;
}>) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState<ArtistProfile>(profile);

  const initials = profile.name
    .split(" ")
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  return (
    <div>
      {/* Profile card */}
      <div className="mb-10 overflow-hidden rounded-2xl border border-border bg-card">
        {editingProfile ? (
          <div className="p-6 space-y-4">
            <h3 className="font-semibold">Edit Profile</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Name" htmlFor="p-name">
                <Input id="p-name" value={profileDraft.name}
                  onChange={(e) => setProfileDraft((p) => ({ ...p, name: e.target.value }))} />
              </FormField>
              <FormField label="Location" htmlFor="p-location">
                <Input id="p-location" value={profileDraft.location}
                  placeholder="City, Country"
                  onChange={(e) => setProfileDraft((p) => ({ ...p, location: e.target.value }))} />
              </FormField>
            </div>
            <FormField label="Bio" htmlFor="p-bio">
              <Textarea id="p-bio" value={profileDraft.bio} rows={3}
                onChange={(e) => setProfileDraft((p) => ({ ...p, bio: e.target.value }))} />
            </FormField>
            <FormField label="Website" htmlFor="p-website">
              <Input id="p-website" value={profileDraft.website}
                placeholder="https://yourwebsite.com"
                onChange={(e) => setProfileDraft((p) => ({ ...p, website: e.target.value }))} />
            </FormField>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="ghost" onClick={() => setEditingProfile(false)}>Cancel</Button>
              <Button onClick={() => { onProfileSave(profileDraft); setEditingProfile(false); }}>Save Profile</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              {profile.location && (
                <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profile.location}
                </p>
              )}
              {profile.bio && (
                <p className="mt-3 text-sm text-foreground leading-relaxed max-w-prose">
                  {profile.bio}
                </p>
              )}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                  {profile.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
            <Button variant="outline" size="sm"
              onClick={() => { setProfileDraft(profile); setEditingProfile(true); }}>
              Edit Profile
            </Button>
          </div>
        )}
      </div>

      {/* In portfolio */}
      <div className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">In Portfolio</h2>
            <p className="text-sm text-muted-foreground">
              {visible.length} artwork{visible.length === 1 ? "" : "s"} visible to visitors
            </p>
          </div>
          <Link href="/dashboard/artworks/new">
            <Button size="sm">+ Add Artwork</Button>
          </Link>
        </div>

        {(() => {
          if (isLoading) {
            return (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({length: 4}).map((_, i) => (
                  <div key={`sk-${i}`} className="aspect-[4/3] animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            );
          }
          if (visible.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
                <p className="text-sm text-muted-foreground">No artworks in portfolio yet.</p>
                <p className="mt-1 text-xs text-muted-foreground">Add artworks from the section below or upload new ones.</p>
              </div>
            );
          }
          return (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {visible.map((artwork, index) => (
                <PortfolioCard
                  key={artwork.id}
                  artwork={artwork}
                  index={index}
                  total={visible.length}
                  onMove={onMove}
                  onToggle={onToggle}
                  isToggling={togglingId === artwork.id}
                  inPortfolio
                />
              ))}
            </div>
          );
        })()}
      </div>

      {/* Not in portfolio */}
      {!isLoading && hidden.length > 0 && (
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-muted-foreground">Not in Portfolio</h2>
            <p className="text-sm text-muted-foreground">
              {hidden.length} artwork{hidden.length === 1 ? "" : "s"} hidden from public profile
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {hidden.map((artwork) => (
              <PortfolioCard
                key={artwork.id}
                artwork={artwork}
                index={0}
                total={0}
                onMove={() => {}}
                onToggle={onToggle}
                isToggling={togglingId === artwork.id}
                inPortfolio={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Portfolio artwork card ─────────────────────────────────────────────────────

interface PortfolioCardProps {
  artwork: ArtworkResponse;
  index: number;
  total: number;
  onMove: (index: number, dir: -1 | 1) => void;
  onToggle: (artwork: ArtworkResponse) => void;
  isToggling: boolean;
  inPortfolio: boolean;
}

function PortfolioCard({
  artwork,
  index,
  total,
  onMove,
  onToggle,
  isToggling,
  inPortfolio,
}: Readonly<PortfolioCardProps>) {
  const primaryImage =
    artwork.images.find((img) => img.isPrimary) ?? artwork.images[0];

  let toggleLabel: string;
  if (isToggling) {
    toggleLabel = "...";
  } else {
    toggleLabel = inPortfolio ? "Hide" : "Show";
  }

  return (
    <div className={`group relative overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md ${inPortfolio ? "border-border" : "border-dashed border-border opacity-60"}`}>
      <Link href={`/dashboard/artworks/${artwork.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={artwork.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        <p className="truncate text-xs font-medium text-card-foreground">{artwork.title}</p>
        {artwork.medium && (
          <p className="truncate text-xs text-muted-foreground">{artwork.medium}</p>
        )}

        <div className="mt-2 flex items-center justify-between gap-1">
          {inPortfolio ? (
            <div className="flex gap-1">
              <button
                onClick={() => onMove(index, -1)}
                disabled={index === 0}
                aria-label="Move left"
                className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => onMove(index, 1)}
                disabled={index === total - 1}
                aria-label="Move right"
                className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : (
            <span />
          )}

          <button
            onClick={() => onToggle(artwork)}
            disabled={isToggling}
            className={`flex h-6 items-center gap-1 rounded px-2 text-xs font-medium transition-colors disabled:opacity-50 ${
              inPortfolio
                ? "border border-border text-muted-foreground hover:border-destructive hover:text-destructive"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {toggleLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type Tab = "preview" | "edit";

export default function PortfolioPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("preview");
  const [profile, setProfile] = useState<ArtistProfile>(DEFAULT_PROFILE);

  const [visible, setVisible] = useState<ArtworkResponse[]>([]);
  const [hidden, setHidden] = useState<ArtworkResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadArtworks = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await listArtworks({ size: 100 });
      const content = result?.content ?? [];
      setVisible(content.filter((a) => a.showOnProfile));
      setHidden(content.filter((a) => !a.showOnProfile));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadArtworks(); }, [loadArtworks]);

  const toggleVisibility = async (artwork: ArtworkResponse) => {
    setTogglingId(artwork.id);
    try {
      await updateArtwork(artwork.id, { showOnProfile: !artwork.showOnProfile });
      if (artwork.showOnProfile) {
        setVisible((v) => v.filter((a) => a.id !== artwork.id));
        setHidden((h) => [{ ...artwork, showOnProfile: false }, ...h]);
      } else {
        setHidden((h) => h.filter((a) => a.id !== artwork.id));
        setVisible((v) => [...v, { ...artwork, showOnProfile: true }]);
      }
    } finally {
      setTogglingId(null);
    }
  };

  const moveVisible = (index: number, direction: -1 | 1) => {
    const to = index + direction;
    if (to < 0 || to >= visible.length) return;
    setVisible((v) => moveItem(v, index, to));
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Portfolio</h1>
        <Link href={`/artist/${user?.userId}`} target="_blank">
          <Button variant="outline" size="sm" className="gap-1.5">
            Open public profile
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" />
            </svg>
          </Button>
        </Link>
      </div>

      {/* Tab bar */}
      <div className="mb-16 flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1 w-fit">
        {(["preview", "edit"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "preview" ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </>
            )}
          </button>
        ))}
      </div>

      {tab === "preview" ? (
        <PortfolioPreview profile={profile} artworks={visible} isLoading={isLoading} />
      ) : (
        <PortfolioEdit
          profile={profile}
          onProfileSave={setProfile}
          visible={visible}
          hidden={hidden}
          isLoading={isLoading}
          onMove={moveVisible}
          onToggle={toggleVisibility}
          togglingId={togglingId}
        />
      )}
    </div>
  );
}
