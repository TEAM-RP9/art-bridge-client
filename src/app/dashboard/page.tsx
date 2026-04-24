"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth";
import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui";
import { ArtworkCard } from "@/components/dashboard";
import { getArtworks, Artwork } from "@/api/artworks";
import LogoutButton from "@/components/auth/LogoutButton";
import Link from "next/link";

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/login?next=/dashboard");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    async function fetchArtworks() {
      try {
        const response = await getArtworks();
        setArtworks(response.items);
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchArtworks();
    }
  }, [isAuthenticated]);

  const actions = (
    <div className="flex gap-2">
      <Button asChild>
        <Link href="/dashboard/artworks/new">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Artwork
        </Link>
      </Button>
      <LogoutButton />
    </div>
  );

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="My Artworks"
        subtitle="Manage your collection and track your progress."
        actions={actions}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[300px] rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : artworks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-dashed border-border rounded-xl text-center px-4">
          <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No artworks yet</h2>
          <p className="text-muted-foreground mb-6 max-w-xs">
            Start by uploading your first masterpiece and share it with the world.
          </p>
          <Button asChild>
            <Link href="/dashboard/artworks/new">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add New Artwork
            </Link>
          </Button>
        </div>
      )}
    </main>
  );
}

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const ImageIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);
