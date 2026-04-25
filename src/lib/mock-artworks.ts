import type { Artwork, ArtistProfile } from "@/types/artwork";

export const mockArtist: ArtistProfile = {
	id: "demo",
	name: "Mari Tamm",
	bio: "Tallinnas tegutsev kunstnik. Värv, vorm ja vaikus.",
	avatarUrl:
		"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
};

export const mockArtworks: Artwork[] = [
	{
		id: "a1",
		artistId: "demo",
		title: "Hommikuvalgus",
		imageUrl:
			"https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&q=80",
		medium: "painting",
		year: 2024,
		width: 80,
		height: 100,
		description: "Õli lõuendil. Sari 'Põhjavalgus'.",
		tags: ["abstraktne", "valgus"],
		createdAt: "2024-09-12T08:00:00.000Z",
	},
	{
		id: "a2",
		artistId: "demo",
		title: "Vaikus II",
		imageUrl:
			"https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&q=80",
		medium: "drawing",
		year: 2023,
		width: 30,
		height: 40,
		tags: ["minimalism"],
		createdAt: "2023-11-04T08:00:00.000Z",
	},
	{
		id: "a3",
		artistId: "demo",
		title: "Tänavad nr. 7",
		imageUrl:
			"https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&q=80",
		medium: "photography",
		year: 2024,
		description: "Mustvalge fotoseeria Mustamäelt.",
		tags: ["foto", "linn"],
		createdAt: "2024-05-22T08:00:00.000Z",
	},
	{
		id: "a4",
		artistId: "demo",
		title: "Vorm 03",
		imageUrl:
			"https://images.unsplash.com/photo-1578321272065-79bc8df82482?w=800&q=80",
		medium: "sculpture",
		year: 2022,
		width: 25,
		height: 60,
		tags: ["keraamika"],
		createdAt: "2022-04-18T08:00:00.000Z",
	},
	{
		id: "a5",
		artistId: "demo",
		title: "Sinised väljad",
		imageUrl:
			"https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=80",
		medium: "digital",
		year: 2025,
		description: "Generatiivne, Procreate.",
		tags: ["digi", "abstraktne"],
		createdAt: "2025-01-30T08:00:00.000Z",
	},
	{
		id: "a6",
		artistId: "demo",
		title: "Studio detail",
		imageUrl:
			"https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
		medium: "mixed-media",
		year: 2023,
		width: 50,
		height: 50,
		tags: ["segatehnika"],
		createdAt: "2023-07-11T08:00:00.000Z",
	},
];
