import { get, post, put, del } from "./api";
import type { RequestOptions } from "./api";

// ── Types ────────────────────────────────────────────────────────────────────

export type ArtworkStatus = "draft" | "published";
export type DimensionUnit = "cm" | "in" | "m";

export interface ArtworkImage {
  id: string;
  url: string;
  width: number;
  height: number;
  isPrimary: boolean;
}

export interface ArtworkResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  medium: string;
  width: number | null;
  height: number | null;
  unit: DimensionUnit;
  year: number | null;
  tags: string[];
  status: ArtworkStatus;
  showOnProfile: boolean;
  images: ArtworkImage[];
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArtworkListResponse {
  content: ArtworkResponse[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface CreateArtworkRequest {
  title: string;
  description?: string;
  category?: string;
  medium?: string;
  width?: number;
  height?: number;
  unit?: DimensionUnit;
  year?: number;
  tags?: string[];
  status: ArtworkStatus;
  showOnProfile: boolean;
}

export type UpdateArtworkRequest = Partial<CreateArtworkRequest>;

export interface ArtworkFilters {
  page?: number;
  size?: number;
  status?: ArtworkStatus;
  category?: string;
  search?: string;
}

export interface UploadImageResponse {
  imageId: string;
  url: string;
  width: number;
  height: number;
}

// ── Mock data (used when NEXT_PUBLIC_USE_MOCK=true) ──────────────────────────

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const MOCK_ARTWORKS: ArtworkResponse[] = [
  {
    id: "m1",
    title: "Morning Light",
    description: "Oil on canvas. Series 'Northern Light'.",
    category: "painting",
    medium: "Oil on canvas",
    width: 80,
    height: 100,
    unit: "cm",
    year: 2024,
    tags: ["abstract", "light"],
    status: "published",
    showOnProfile: true,
    images: [
      {
        id: "img1",
        url: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&q=80",
        width: 800,
        height: 1000,
        isPrimary: true,
      },
    ],
    viewCount: 142,
    likeCount: 23,
    createdAt: "2024-09-12T08:00:00.000Z",
    updatedAt: "2024-09-12T08:00:00.000Z",
  },
  {
    id: "m2",
    title: "Silence II",
    description: "",
    category: "drawing",
    medium: "Charcoal",
    width: 30,
    height: 40,
    unit: "cm",
    year: 2023,
    tags: ["minimalism"],
    status: "published",
    showOnProfile: true,
    images: [
      {
        id: "img2",
        url: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&q=80",
        width: 800,
        height: 1067,
        isPrimary: true,
      },
    ],
    viewCount: 87,
    likeCount: 14,
    createdAt: "2023-11-04T08:00:00.000Z",
    updatedAt: "2023-11-04T08:00:00.000Z",
  },
  {
    id: "m3",
    title: "Streets No. 7",
    description: "Black and white photo series from Mustamäe.",
    category: "photography",
    medium: "Digital photography",
    width: null,
    height: null,
    unit: "cm",
    year: 2024,
    tags: ["photo", "urban"],
    status: "draft",
    showOnProfile: false,
    images: [
      {
        id: "img3",
        url: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&q=80",
        width: 800,
        height: 533,
        isPrimary: true,
      },
    ],
    viewCount: 0,
    likeCount: 0,
    createdAt: "2024-05-22T08:00:00.000Z",
    updatedAt: "2024-05-22T08:00:00.000Z",
  },
];

let mockStore = [...MOCK_ARTWORKS];

function mockDelay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 400));
}

// ── API functions ────────────────────────────────────────────────────────────

export const listArtworks = (
  filters: ArtworkFilters = {},
  opts?: RequestOptions
): Promise<ArtworkListResponse> => {
  if (USE_MOCK) {
    let items = [...mockStore];
    if (filters.status) items = items.filter((a) => a.status === filters.status);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.medium.toLowerCase().includes(q)
      );
    }
    return mockDelay({
      content: items,
      totalElements: items.length,
      totalPages: 1,
      page: 0,
      size: items.length,
    });
  }
  const params = new URLSearchParams();
  if (filters.page !== undefined) params.set("page", String(filters.page));
  if (filters.size !== undefined) params.set("size", String(filters.size));
  if (filters.status) params.set("status", filters.status);
  if (filters.category) params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);
  const qs = params.toString();
  let url = "/artworks";
  if (qs) {
    url += "?" + qs;
  }
  return get<ArtworkListResponse>(url, opts);
};

export const getArtwork = (id: string, opts?: RequestOptions): Promise<ArtworkResponse> => {
  if (USE_MOCK) {
    const artwork = mockStore.find((a) => a.id === id);
    if (!artwork) return Promise.reject(new Error("Not found"));
    return mockDelay(artwork);
  }
  return get<ArtworkResponse>(`/artworks/${id}`, opts);
};

export const createArtwork = (
  data: CreateArtworkRequest,
  opts?: RequestOptions
): Promise<ArtworkResponse> => {
  if (USE_MOCK) {
    const newArtwork: ArtworkResponse = {
      id: `m${Date.now()}`,
      title: data.title,
      description: data.description ?? "",
      category: data.category ?? "",
      medium: data.medium ?? "",
      width: data.width ?? null,
      height: data.height ?? null,
      unit: data.unit ?? "cm",
      year: data.year ?? null,
      tags: data.tags ?? [],
      status: data.status,
      showOnProfile: data.showOnProfile,
      images: [],
      viewCount: 0,
      likeCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockStore = [newArtwork, ...mockStore];
    return mockDelay(newArtwork);
  }
  return post<ArtworkResponse>("/artworks", data, opts);
};

export const updateArtwork = (
  id: string,
  data: UpdateArtworkRequest,
  opts?: RequestOptions
): Promise<ArtworkResponse> => {
  if (USE_MOCK) {
    const idx = mockStore.findIndex((a) => a.id === id);
    if (idx === -1) return Promise.reject(new Error("Not found"));
    mockStore[idx] = { ...mockStore[idx], ...data, updatedAt: new Date().toISOString() };
    return mockDelay(mockStore[idx]);
  }
  return put<ArtworkResponse>(`/artworks/${id}`, data, opts);
};

export const deleteArtwork = (id: string, opts?: RequestOptions): Promise<void> => {
  if (USE_MOCK) {
    mockStore = mockStore.filter((a) => a.id !== id);
    return mockDelay(undefined);
  }
  return del<void>(`/artworks/${id}`, opts);
};

export async function uploadArtworkImage(
  artworkId: string,
  file: File,
  signal?: AbortSignal
): Promise<UploadImageResponse> {
  if (USE_MOCK) {
    const objectUrl = URL.createObjectURL(file);
    const fakeImage: ArtworkImage = {
      id: `img${Date.now()}`,
      url: objectUrl,
      width: 800,
      height: 600,
      isPrimary: true,
    };
    const idx = mockStore.findIndex((a) => a.id === artworkId);
    if (idx !== -1) mockStore[idx].images = [fakeImage];
    return mockDelay({
      imageId: fakeImage.id,
      url: objectUrl,
      width: 800,
      height: 600,
    });
  }

  const formData = new FormData();
  formData.append("file", file);

  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
  const response = await fetch(`${base}/artworks/${artworkId}/images`, {
    method: "POST",
    body: formData,
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json() as Promise<UploadImageResponse>;
}
