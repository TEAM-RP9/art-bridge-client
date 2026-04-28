/**
 * Domain types for portfolio / artwork views.
 * Keep this file dependency-free — it is imported by both UI and store layers.
 */


export type ArtworkType =
	| "painting"
	| "drawing"
	| "photography"
	| "sculpture"
	| "digital"
	| "mixed-media"
	| "other";

export const ARTWORK_TYPE_LABELS: Record<ArtworkType, string> = {
	painting: "Painting",
	drawing: "Drawing",
	photography: "Photography",
	sculpture: "Sculpture",
	digital: "Digital",
	"mixed-media": "Mixed media",
	other: "Other",
};

export interface Artwork {
	id: string;
	artistId: string;
	title: string;
	imageUrl: string;
	type: ArtworkType;
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
