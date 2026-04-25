/**
 * Domain types for portfolio / artwork views.
 * Keep this file dependency-free — it is imported by both UI and store layers.
 */

export type ArtworkMedium =
	| "painting"
	| "drawing"
	| "photography"
	| "sculpture"
	| "digital"
	| "mixed-media"
	| "other";

export const ARTWORK_MEDIUM_LABELS: Record<ArtworkMedium, string> = {
	painting: "Maal",
	drawing: "Joonistus",
	photography: "Fotograafia",
	sculpture: "Skulptuur",
	digital: "Digitaalne",
	"mixed-media": "Segatehnika",
	other: "Muu",
};

export interface Artwork {
	id: string;
	artistId: string;
	title: string;
	imageUrl: string;
	medium: ArtworkMedium;
	year: number;
	width?: number;
	height?: number;
	description?: string;
	tags?: string[];
	createdAt: string;
}

export interface ArtistProfile {
	id: string;
	name: string;
	bio?: string;
	avatarUrl?: string;
}
