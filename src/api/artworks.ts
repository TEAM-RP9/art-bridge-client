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
  mediaId: number;
}

export type UpdateArtworkRequest = Partial<CreateArtworkRequest>;

export interface ArtworkFilters {
  page?: number;
  size?: number;
  status?: ArtworkStatus;
  category?: string;
  search?: string;
}

export interface PublicArtworkFilters {
  size?: number;
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

// ── Wire-format translation ──────────────────────────────────────────────────

const CATEGORY_TO_API: Record<string, string> = {
  painting: "PAINTING",
  drawing: "DRAWING",
  sculpture: "SCULPTURE",
  photography: "PHOTOGRAPHY",
  printmaking: "PRINT",
  digital: "DIGITAL",
  "mixed-media": "MIXED_MEDIA",
  other: "OTHER",
};

const CATEGORY_FROM_API: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_TO_API).map(([k, v]) => [v, k])
);

const STATUS_TO_API: Record<ArtworkStatus, string> = {
  draft: "DRAFT",
  published: "PUBLISHED",
};

const STATUS_FROM_API: Record<string, ArtworkStatus> = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

const DIMENSION_UNIT_TO_API: Record<DimensionUnit, string> = {
  cm: "CM",
  in: "IN",
  m: "M",
};

const DIMENSION_UNIT_FROM_API: Record<string, DimensionUnit> = {
  CM: "cm",
  IN: "in",
  M: "m",
};

interface WireArtwork {
  id: number | string;
  title: string;
  description: string;
  category: string | null;
  medium: string | null;
  style?: string | null;
  width: number | null;
  height: number | null;
  dimensionUnit: string | null;
  creationYear: number | null;
  tags: string[] | null;
  status: string;
  showOnProfile: boolean;
  imageUrl?: string | null;
  mediaId?: number | string | null;
  viewsCount?: number;
  likesCount?: number;
  viewCount?: number;
  likeCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface WireArtworkListResponse {
  items?: WireArtwork[];
  content?: WireArtwork[];
  totalCount?: number;
  totalElements?: number;
  totalPages: number;
  currentPage?: number;
  page?: number;
  pageSize?: number;
  size?: number;
}

function safeImageUrl(url: string): string {
  if (typeof window === "undefined") return url;
  if (window.location.protocol !== "https:") return url;
  if (!url.startsWith("http://")) return url;
  try {
    const u = new URL(url);
    return `/api${u.pathname}${u.search}`;
  } catch {
    return url;
  }
}

function fromApiArtwork(raw: WireArtwork): ArtworkResponse {
  const rawUnit = raw.dimensionUnit;
  const images: ArtworkImage[] = raw.imageUrl
    ? [
        {
          id: String(raw.mediaId ?? raw.id),
          url: safeImageUrl(raw.imageUrl),
          width: raw.width ?? 0,
          height: raw.height ?? 0,
          isPrimary: true,
        },
      ]
    : [];
  return {
    id: String(raw.id),
    title: raw.title,
    description: raw.description,
    category: raw.category ? (CATEGORY_FROM_API[raw.category] ?? raw.category) : "",
    medium: raw.medium ?? "",
    width: raw.width,
    height: raw.height,
    unit: rawUnit ? (DIMENSION_UNIT_FROM_API[rawUnit] ?? "cm") : "cm",
    year: raw.creationYear,
    tags: raw.tags ?? [],
    status: STATUS_FROM_API[raw.status] ?? (raw.status as ArtworkStatus),
    showOnProfile: raw.showOnProfile,
    images,
    viewCount: raw.viewCount ?? raw.viewsCount ?? 0,
    likeCount: raw.likeCount ?? raw.likesCount ?? 0,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function toApiPayload<T extends UpdateArtworkRequest>(data: T): Record<string, unknown> {
  const { unit, year, ...rest } = data as UpdateArtworkRequest;
  const payload: Record<string, unknown> = { ...rest };
  if (data.status !== undefined) {
    payload.status = STATUS_TO_API[data.status];
  }
  if (data.category) {
    payload.category = CATEGORY_TO_API[data.category] ?? data.category;
  }
  if (unit !== undefined) {
    payload.dimensionUnit = DIMENSION_UNIT_TO_API[unit];
  }
  if (year !== undefined) {
    payload.creationYear = year;
  }
  return payload;
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
  if (filters.status) params.set("status", STATUS_TO_API[filters.status]);
  if (filters.category) {
    params.set("category", CATEGORY_TO_API[filters.category] ?? filters.category);
  }
  if (filters.search) params.set("search", filters.search);
  const qs = params.toString();
  let url = "/artworks";
  if (qs) {
    url += "?" + qs;
  }
  return get<WireArtworkListResponse>(url, opts).then((res) => {
    const wireItems = res.items ?? res.content ?? [];
    return {
      content: wireItems.map(fromApiArtwork),
      totalElements: res.totalCount ?? res.totalElements ?? wireItems.length,
      totalPages: res.totalPages ?? 1,
      page: res.currentPage ?? res.page ?? 0,
      size: res.pageSize ?? res.size ?? wireItems.length,
    };
  });
};

export const getArtwork = (id: string, opts?: RequestOptions): Promise<ArtworkResponse> => {
  if (USE_MOCK) {
    const artwork = mockStore.find((a) => a.id === id);
    if (!artwork) return Promise.reject(new Error("Not found"));
    return mockDelay(artwork);
  }
  return get<WireArtwork>(`/artworks/${id}`, opts).then(fromApiArtwork);
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
      images: data.mediaId ? [{ id: `img${Date.now()}`, url: `https://placeholder.mock/media/${data.mediaId}`, width: 800, height: 600, isPrimary: true }] : [],
      viewCount: 0,
      likeCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockStore = [newArtwork, ...mockStore];
    return mockDelay(newArtwork);
  }
  return post<WireArtwork>("/artworks", toApiPayload(data), opts).then(fromApiArtwork);
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
  return put<WireArtwork>(`/artworks/${id}`, toApiPayload(data), opts).then(fromApiArtwork);
};

export const deleteArtwork = (id: string, opts?: RequestOptions): Promise<void> => {
  if (USE_MOCK) {
    mockStore = mockStore.filter((a) => a.id !== id);
    return mockDelay(undefined);
  }
  return del<void>(`/artworks/${id}`, opts);
};

export const listArtistArtworks = (
  artistId: string,
  filters: PublicArtworkFilters = {},
  opts?: RequestOptions
): Promise<ArtworkListResponse> => {
  const params = new URLSearchParams();
  if (filters.size !== undefined) params.set("size", String(filters.size));
  const qs = params.toString();
  const url = `/artists/${artistId}/artworks` + (qs ? "?" + qs : "");
  return get<WireArtworkListResponse>(url, opts).then((res) => {
    const wireItems = res.items ?? res.content ?? [];
    return {
      content: wireItems.map(fromApiArtwork),
      totalElements: res.totalCount ?? res.totalElements ?? wireItems.length,
      totalPages: res.totalPages ?? 1,
      page: res.currentPage ?? res.page ?? 0,
      size: res.pageSize ?? res.size ?? wireItems.length,
    };
  });
};
