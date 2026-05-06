"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { listArtworks } from "@/api";
import type { ArtworkResponse } from "@/api";
import { PublicNav } from "@/components/common";

// ── Mock featured artists ─────────────────────────────────────────────────────

const FEATURED_ARTISTS = [
  {
    id: "1",
    name: "Sofia Anderson",
    bio: "Contemporary artist exploring themes of nature, identity, and memory through expressive figurative work.",
    location: "Tallinn, Estonia",
    works: 12,
    coverUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&q=80",
  },
  {
    id: "2",
    name: "Emma Rodriguez",
    bio: "Contemporary abstract artist exploring color theory and emotional landscapes.",
    location: "Barcelona, Spain",
    works: 24,
    coverUrl: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&q=80",
  },
  {
    id: "3",
    name: "Marcus Chen",
    bio: "Digital sculptor and 3D artist creating otherworldly forms inspired by organic structures.",
    location: "Singapore",
    works: 18,
    coverUrl: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&q=80",
  },
  {
    id: "4",
    name: "Yuki Tanaka",
    bio: "Printmaker and illustrator working at the intersection of tradition and the contemporary.",
    location: "Kyoto, Japan",
    works: 31,
    coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function FeaturedArtworkCard({ artwork }: Readonly<{ artwork: ArtworkResponse }>) {
  const image = artwork.images.find((i) => i.isPrimary) ?? artwork.images[0];
  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {image && (
          <Image
            src={image.url}
            alt={artwork.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="truncate text-sm font-semibold text-card-foreground">{artwork.title}</h3>
        {artwork.medium && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {artwork.medium}{artwork.creationYear ? `, ${artwork.creationYear}` : ""}
          </p>
        )}
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
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

function ArtistCard({ artist }: Readonly<{ artist: typeof FEATURED_ARTISTS[0] }>) {
  return (
    <Link href={`/artist/${artist.id}`} className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-32 overflow-hidden bg-muted">
        <Image
          src={artist.coverUrl}
          alt=""
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground ring-2 ring-background">
          {artist.name.charAt(0)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-card-foreground">{artist.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{artist.bio}</p>
        <p className="mt-3 text-xs text-muted-foreground">{artist.works} works · {artist.location}</p>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [artworks, setArtworks] = useState<ArtworkResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listArtworks({ status: "published", size: 6 })
      .then((r) => setArtworks(r?.content ?? []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          For Artists, By Artists
        </span>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Showcase Your Art to<br />
          <span className="text-primary">The World</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground">
          Create a stunning portfolio, connect with collectors, and grow your artistic career.
          Join thousands of artists already on ArtBridge.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start Your Portfolio
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
            Browse Artworks
          </Link>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-8">
          {[
            { value: "2,500+", label: "Active Artists" },
            { value: "15,000+", label: "Artworks" },
            { value: "50K+", label: "Monthly Views" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold text-primary">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Artworks ─────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Featured Artworks</h2>
              <p className="mt-1 text-sm text-muted-foreground">Discover exceptional work from our community</p>
            </div>
            <Link href="/discover" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }, (_, i) => <ArtworkSkeleton key={i} />)
              : artworks.map((a) => <FeaturedArtworkCard key={a.id} artwork={a} />)}
          </div>
        </div>
      </section>

      {/* ── Featured Artists ──────────────────────────────────────────────────── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Featured Artists</h2>
              <p className="mt-1 text-sm text-muted-foreground">Connect with talented creators</p>
            </div>
            <Link href="/discover?tab=artists" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_ARTISTS.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/30 px-4 py-16 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground">Everything You Need</h2>
          <p className="mt-2 text-sm text-muted-foreground">Powerful tools to manage and showcase your portfolio</p>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                ),
                title: "Beautiful Portfolio",
                desc: "Create a stunning portfolio that showcases your work in the best light",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Connect with Collectors",
                desc: "Build relationships with art enthusiasts and potential buyers",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
                title: "Track Your Growth",
                desc: "Analyse your performance with detailed analytics and insights",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {icon}
                </div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────────── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/70 px-8 py-16 text-center text-primary-foreground shadow-lg">
          <h2 className="text-3xl font-bold">Ready to Start Your Journey?</h2>
          <p className="mt-3 text-sm text-primary-foreground/80">
            Join our community of artists and start building your portfolio today
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 px-6 py-3 text-sm font-medium text-primary-foreground backdrop-blur transition-colors hover:bg-primary-foreground/20"
          >
            Create Free Account
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border px-4 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-sm font-semibold text-foreground">ArtBridge</span>
          <p className="text-xs text-muted-foreground">© 2026 ArtBridge. Built for artists, by artists.</p>
        </div>
      </footer>
    </div>
  );
}
