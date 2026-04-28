import { get, post } from './index';

export interface Artwork {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  viewsCount: number;
  likesCount: number;
  category?: string;
  medium?: string;
  dimensions?: {
    width: number;
    height: number;
    unit: string;
  };
  creationYear?: number;
  tags?: string[];
  status: 'DRAFT' | 'PUBLISHED';
  showOnProfile: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArtworkRequest {
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  medium?: string;
  dimensions?: {
    width: number;
    height: number;
    unit: string;
  };
  creationYear?: number;
  tags?: string[];
  status: 'DRAFT' | 'PUBLISHED';
  showOnProfile: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export const getArtworks = (page = 1, size = 10) =>
  get<PaginatedResponse<Artwork>>(`/artworks/my?page=${page - 1}&size=${size}`);

export const createArtwork = (artwork: CreateArtworkRequest) =>
  post<Artwork>('/artworks', artwork);
