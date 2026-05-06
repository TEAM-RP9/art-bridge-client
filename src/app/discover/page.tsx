"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PublicNav } from "@/components/common";
import type { ArtworkResponse } from "@/api";
import { CATEGORY_LABELS } from "@/lib/constants";

// ── Types ──────────────────────────────────────────────────────────────────────

interface PublicArtist {
  id: string;
  name: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  worksCount: number;
}

export interface PublicArtwork extends ArtworkResponse {
  artist: PublicArtist;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
];

const YEARS = [
  { value: "all", label: "All Time" },
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
  { value: "older", label: "Before 2021" },
];

// ── Mock data (replace with real public API when available) ───────────────────

const MOCK_ARTISTS: Record<string, Omit<PublicArtist, "worksCount">> = {
  "1": { id: "1", name: "Sofia Anderson", location: "Tallinn, Estonia", bio: "Contemporary artist exploring themes of nature, identity, and memory through expressive figurative work." },
  "2": { id: "2", name: "Emma Rodriguez", location: "Barcelona, Spain", bio: "Contemporary abstract artist exploring color theory and emotional landscapes." },
  "3": { id: "3", name: "Marcus Chen", location: "Singapore", bio: "Digital sculptor and 3D artist creating otherworldly forms inspired by organic structures." },
  "4": { id: "4", name: "Yuki Tanaka", location: "Kyoto, Japan", bio: "Printmaker and illustrator working at the intersection of tradition and the contemporary." },
};

function artist(id: string, worksCount: number): PublicArtist {
  return { ...MOCK_ARTISTS[id], worksCount };
}

export const MOCK_DISCOVER_ARTWORKS: PublicArtwork[] = [
  {
    id: "d1",
    title: "Chromatic Dreams",
    description: "An exploration of vibrant color interactions and emotional resonance through layered acrylic techniques.",
    category: "painting", medium: "Acrylic on canvas",
    width: 120, height: 90, unit: "cm", year: 2024,
    tags: ["abstract", "colorful", "modern", "large"],
    status: "published", showOnProfile: true,
    images: [{ id: "di1", url: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&q=80", width: 800, height: 600, isPrimary: true }],
    viewCount: 1834, likeCount: 142,
    createdAt: "2024-03-15T00:00:00.000Z", updatedAt: "2024-03-15T00:00:00.000Z",
    artist: artist("2", 24),
  },
  {
    id: "d2",
    title: "Ethereal Form",
    description: "A sculptural study of the human figure, captured at the boundary between movement and stillness.",
    category: "sculpture", medium: "Bronze",
    width: 40, height: 80, unit: "cm", year: 2024,
    tags: ["figurative", "bronze", "contemporary"],
    status: "published", showOnProfile: true,
    images: [{ id: "di2", url: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&q=80", width: 800, height: 1067, isPrimary: true }],
    viewCount: 1203, likeCount: 89,
    createdAt: "2024-01-20T00:00:00.000Z", updatedAt: "2024-01-20T00:00:00.000Z",
    artist: artist("1", 12),
  },
  {
    id: "d3",
    title: "Void and Light",
    description: "A long-exposure photograph of a storm system photographed from above the clouds.",
    category: "photography", medium: "Digital photography",
    width: null, height: null, unit: "cm", year: 2024,
    tags: ["aerial", "nature", "abstract", "monochrome"],
    status: "published", showOnProfile: true,
    images: [{ id: "di3", url: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&q=80", width: 800, height: 533, isPrimary: true }],
    viewCount: 2876, likeCount: 201,
    createdAt: "2024-02-08T00:00:00.000Z", updatedAt: "2024-02-08T00:00:00.000Z",
    artist: artist("3", 18),
  },
  {
    id: "d4",
    title: "Misty Mountains",
    description: "Plein-air oil painting captured during early morning in the Estonian highlands. Part of the 'Northern Light' series.",
    category: "painting", medium: "Oil on canvas",
    width: 80, height: 60, unit: "cm", year: 2024,
    tags: ["landscape", "plein-air", "nature", "nordic"],
    status: "published", showOnProfile: true,
    images: [{ id: "di4", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", width: 800, height: 800, isPrimary: true }],
    viewCount: 4123, likeCount: 298,
    createdAt: "2024-04-10T00:00:00.000Z", updatedAt: "2024-04-10T00:00:00.000Z",
    artist: artist("4", 31),
  },
  {
    id: "d5",
    title: "Geometry in Stone",
    description: "Urban documentary series exploring architectural repetition and shadow play in modernist buildings.",
    category: "photography", medium: "Film photography",
    width: null, height: null, unit: "cm", year: 2024,
    tags: ["architecture", "urban", "monochrome", "geometry"],
    status: "published", showOnProfile: true,
    images: [{ id: "di5", url: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&q=80&sat=-100", width: 800, height: 600, isPrimary: true }],
    viewCount: 1987, likeCount: 134,
    createdAt: "2024-05-01T00:00:00.000Z", updatedAt: "2024-05-01T00:00:00.000Z",
    artist: artist("3", 18),
  },
  {
    id: "d6",
    title: "The Wanderer",
    description: "A meditation on solitude and luminescence. Digital composition built from over 200 hand-drawn layers.",
    category: "digital", medium: "Digital illustration",
    width: null, height: null, unit: "cm", year: 2023,
    tags: ["atmospheric", "solitude", "light"],
    status: "published", showOnProfile: true,
    images: [{ id: "di6", url: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&q=80&hue=180", width: 800, height: 1067, isPrimary: true }],
    viewCount: 3421, likeCount: 234,
    createdAt: "2023-11-12T00:00:00.000Z", updatedAt: "2023-11-12T00:00:00.000Z",
    artist: artist("1", 12),
  },
  {
    id: "d7",
    title: "Night Traces",
    description: "Charcoal study exploring gesture and movement. From a series drawn in a single overnight session.",
    category: "drawing", medium: "Charcoal on paper",
    width: 50, height: 70, unit: "cm", year: 2025,
    tags: ["gesture", "figure", "charcoal", "study"],
    status: "published", showOnProfile: true,
    images: [{ id: "di7", url: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&q=80&sat=-80", width: 800, height: 533, isPrimary: true }],
    viewCount: 567, likeCount: 45,
    createdAt: "2025-01-30T00:00:00.000Z", updatedAt: "2025-01-30T00:00:00.000Z",
    artist: artist("2", 24),
  },
  {
    id: "d8",
    title: "Echoes",
    description: "Linocut print from the 'Memory' series. Hand-inked on Japanese kozo paper, edition of 15.",
    category: "printmaking", medium: "Linocut",
    width: 30, height: 40, unit: "cm", year: 2023,
    tags: ["linocut", "edition", "memory", "handmade"],
    status: "published", showOnProfile: true,
    images: [{ id: "di8", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&sat=-60", width: 800, height: 800, isPrimary: true }],
    viewCount: 892, likeCount: 78,
    createdAt: "2023-08-05T00:00:00.000Z", updatedAt: "2023-08-05T00:00:00.000Z",
    artist: artist("4", 31),
  },
];

// ── Icons ──────────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ArtworkCard({ artwork }: Readonly<{ artwork: PublicArtwork }>) {
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="truncate text-sm font-semibold text-card-foreground">{artwork.title}</h3>
        <p className="mt-0.5 text-xs text-primary">{artwork.artist.name}</p>
        {artwork.medium && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {artwork.medium}{artwork.year ? `, ${artwork.year}` : ""}
          </p>
        )}
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><EyeIcon />{artwork.viewCount.toLocaleString()}</span>
          <span className="flex items-center gap-1"><HeartIcon />{artwork.likeCount.toLocaleString()}</span>
          {artwork.year && <span className="ml-auto">{artwork.year}</span>}
        </div>
      </div>
    </Link>
  );
}

function ArtistCard({ artist }: Readonly<{ artist: PublicArtist }>) {
  return (
    <Link
      href={`/artist/${artist.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        {artist.avatarUrl ? (
          <Image src={artist.avatarUrl} alt={artist.name} width={56} height={56} className="shrink-0 rounded-full object-cover" />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
            {artist.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold text-card-foreground transition-colors group-hover:text-primary">{artist.name}</h3>
          {artist.location && <p className="mt-0.5 text-xs text-muted-foreground">{artist.location}</p>}
          <p className="mt-0.5 text-xs text-muted-foreground">{artist.worksCount} works</p>
        </div>
      </div>
      {artist.bio && (
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{artist.bio}</p>
      )}
    </Link>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

function DiscoverContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get("tab") === "artists" ? "artists" : "artworks";
  const [view, setView] = useState<"artworks" | "artists">(initialTab);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [category, setCategory] = useState("all");
  const [year, setYear] = useState("all");

  const filteredArtworks = useMemo(() => {
    let items = [...MOCK_DISCOVER_ARTWORKS];

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.artist.name.toLowerCase().includes(q) ||
          a.medium?.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (category !== "all") items = items.filter((a) => a.category === category);
    if (year !== "all") {
      if (year === "older") {
        items = items.filter((a) => a.year !== null && a.year < 2021);
      } else {
        items = items.filter((a) => a.year === Number.parseInt(year, 10));
      }
    }

    if (sortBy === "popular") {
      items.sort((a, b) => b.viewCount + b.likeCount - (a.viewCount + a.likeCount));
    } else {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return items;
  }, [search, category, year, sortBy]);

  const artists = useMemo<PublicArtist[]>(() => {
    const seen = new Set<string>();
    const allArtists: PublicArtist[] = [];
    for (const artwork of MOCK_DISCOVER_ARTWORKS) {
      if (!seen.has(artwork.artist.id)) {
        seen.add(artwork.artist.id);
        const count = MOCK_DISCOVER_ARTWORKS.filter((a) => a.artist.id === artwork.artist.id).length;
        allArtists.push({ ...artwork.artist, worksCount: count });
      }
    }
    if (!search.trim()) return allArtists;
    const q = search.toLowerCase();
    return allArtists.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.location?.toLowerCase().includes(q) ||
        a.bio?.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Discover Art</h1>
          <p className="mt-1 text-sm text-muted-foreground">Explore exceptional artworks from around the world</p>
        </div>

        {/* Search + view toggle */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder={view === "artworks" ? "Search artworks, artists, or tags…" : "Search artists…"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex shrink-0 rounded-lg border border-border bg-background p-1">
            <button
              type="button"
              onClick={() => setView("artworks")}
              className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                view === "artworks"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
              </svg>
              Artworks
            </button>
            <button
              type="button"
              onClick={() => setView("artists")}
              className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                view === "artists"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Artists
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex gap-8">
          {/* Filters sidebar — hidden on small screens */}
          <aside className="hidden w-48 shrink-0 lg:block">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Sort By</p>
              <div className="mt-3 space-y-2.5">
                {(
                  [
                    ["recent", "Most Recent"],
                    ["popular", "Most Popular"],
                  ] as const
                ).map(([val, label]) => (
                  <label key={val} className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="radio"
                      name="sortBy"
                      value={val}
                      checked={sortBy === val}
                      onChange={() => setSortBy(val)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-foreground">{label}</span>
                  </label>
                ))}
              </div>

              <div className="my-4 border-t border-border" />

              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Filter By</p>

              <div className="mt-3 space-y-4">
                <div>
                  <label htmlFor="category-select" className="mb-1.5 block text-xs font-medium text-foreground">Category</label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full appearance-none rounded-md border border-border bg-background px-3 py-1.5 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    <ChevronIcon />
                  </div>
                </div>

                <div>
                  <label htmlFor="year-select" className="mb-1.5 block text-xs font-medium text-foreground">Year</label>
                  <div className="relative">
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full appearance-none rounded-md border border-border bg-background px-3 py-1.5 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {YEARS.map((y) => (
                        <option key={y.value} value={y.value}>{y.label}</option>
                      ))}
                    </select>
                    <ChevronIcon />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0 flex-1">
            {view === "artworks" && (
              <>
                <p className="mb-4 text-sm text-muted-foreground">
                  {filteredArtworks.length} {filteredArtworks.length === 1 ? "artwork" : "artworks"} found
                </p>
                {filteredArtworks.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="font-medium text-foreground">No artworks found</p>
                    <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredArtworks.map((artwork) => (
                      <ArtworkCard key={artwork.id} artwork={artwork} />
                    ))}
                  </div>
                )}
              </>
            )}

            {view === "artists" && (
              <>
                <p className="mb-4 text-sm text-muted-foreground">
                  {artists.length} {artists.length === 1 ? "artist" : "artists"} found
                </p>
                {artists.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="font-medium text-foreground">No artists found</p>
                    <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {artists.map((a) => (
                      <ArtistCard key={a.id} artist={a} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense>
      <DiscoverContent />
    </Suspense>
  );
}
