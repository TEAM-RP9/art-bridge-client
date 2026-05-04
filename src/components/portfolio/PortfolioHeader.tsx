import Image from "next/image";
import { Heading } from "@/components/ui/Heading";
import { Paragraph } from "@/components/ui/Paragraph";
import { type ArtistProfile } from "@/types/artwork";

interface PortfolioHeaderProps {
  readonly artist: ArtistProfile;
}

export function PortfolioHeader({ artist }: PortfolioHeaderProps) {
  return (
    <div className="flex items-center gap-5 pb-8">
      {artist.avatarUrl ? (
        <Image
          src={artist.avatarUrl}
          alt={artist.name}
          width={80}
          height={80}
          className="rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-secondary-foreground">
          {artist.name.charAt(0)}
        </div>
      )}

      <div className="min-w-0">
        <Heading level="h2">{artist.name}</Heading>
        {artist.bio ? (
          <Paragraph color="muted" size="sm" className="mt-1">
            {artist.bio}
          </Paragraph>
        ) : null}
      </div>
    </div>
  );
}
