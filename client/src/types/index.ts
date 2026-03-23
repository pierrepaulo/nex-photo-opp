export const Role = {
  ADMIN: 'ADMIN',
  PROMOTER: 'PROMOTER',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface User {
  id: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Photo {
  id: string;
  originalUrl: string;
  framedUrl: string;
  downloadToken: string;
  promoterId: string;
  createdAt: string;
}

/** Resposta de POST /api/photos (alinhado à Fase 4.10 / PhotoResponseDTO). */
export interface UploadPhotoResponse {
  id: string;
  framedUrl: string;
  downloadToken: string;
  downloadUrl: string;
  createdAt: string;
}

/** Resposta pública de GET /api/download/:token. */
export interface DownloadPhotoResponse {
  framedUrl: string;
}

export interface Log {
  id: string;
  userId: string | null;
  userName: string;
  ipAddress: string;
  method: string;
  route: string;
  requestBody: string | null;
  responseStatus: number;
  actionType: string;
  userAgent: string | null;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Item retornado por GET /api/admin/photos. */
export interface AdminPhotoRow {
  id: string;
  framedUrl: string;
  downloadToken: string;
  createdAt: string;
}

export interface PhotoStats {
  totalPhotos: number;
  filteredPhotos: number;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
