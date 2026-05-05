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
  dimensionUnit: DimensionUnit | null;
  creationYear: number | null;
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
  dimensionUnit?: DimensionUnit;
  creationYear?: number;
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
    dimensionUnit: rawUnit ? (DIMENSION_UNIT_FROM_API[rawUnit] ?? null) : null,
    creationYear: raw.creationYear,
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
  const payload: Record<string, unknown> = { ...data };
  if (data.status !== undefined) {
    payload.status = STATUS_TO_API[data.status];
  }
  if (data.category) {
    payload.category = CATEGORY_TO_API[data.category] ?? data.category;
  }
  if (data.dimensionUnit !== undefined) {
    payload.dimensionUnit = DIMENSION_UNIT_TO_API[data.dimensionUnit];
  }
  return payload;
}

// ── API functions ────────────────────────────────────────────────────────────

export const listArtworks = (
  filters: ArtworkFilters = {},
  opts?: RequestOptions
): Promise<ArtworkListResponse> => {
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
  return get<WireArtwork>(`/artworks/${id}`, opts).then(fromApiArtwork);
};

export const createArtwork = (
  data: CreateArtworkRequest,
  opts?: RequestOptions
): Promise<ArtworkResponse> => {
  return post<WireArtwork>("/artworks", toApiPayload(data), opts).then(fromApiArtwork);
};

export const updateArtwork = (
  id: string,
  data: UpdateArtworkRequest,
  opts?: RequestOptions
): Promise<ArtworkResponse> => {
  return put<WireArtwork>(`/artworks/${id}`, toApiPayload(data), opts).then(fromApiArtwork);
};

export const deleteArtwork = (id: string, opts?: RequestOptions): Promise<void> => {
  return del<void>(`/artworks/${id}`, opts);
};
