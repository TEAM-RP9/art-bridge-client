import { setAuthInterceptor } from './api';
import { redirectToLogin, refreshSession } from './auth';

setAuthInterceptor({ refresh: refreshSession, onFailure: redirectToLogin });

export { ApiError, del, get, patch, post, put } from './api';
export type { ApiFieldError, ProblemDetail, RequestOptions } from './api';
export { getCurrentUser, googleLogin, login, logout, redirectToLogin, register } from './auth';
export type { AuthResponse, UserResponse } from './auth';

export {
  createArtwork,
  deleteArtwork,
  getArtwork,
  listArtworks,
  updateArtwork,
  uploadArtworkImage,
} from './artworks';
export type {
  ArtworkFilters,
  ArtworkImage,
  ArtworkListResponse,
  ArtworkResponse,
  ArtworkStatus,
  CreateArtworkRequest,
  DimensionUnit,
  UpdateArtworkRequest,
  UploadImageResponse,
} from './artworks';

export { normalizeMediaUrl, uploadMedia } from './media';
export type { MediaUploadResponse } from './media';
