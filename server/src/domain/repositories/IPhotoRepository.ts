import { Photo } from '@/domain/entities/Photo';

export interface PhotoFilters {
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface CreatePhotoInput {
  originalUrl: string;
  framedUrl: string;
  downloadToken: string;
  promoterId: string;
}

export interface IPhotoRepository {
  create(data: CreatePhotoInput): Promise<Photo>;
  findById(id: string): Promise<Photo | null>;
  findByToken(token: string): Promise<Photo | null>;
  findMany(filters: PhotoFilters): Promise<Photo[]>;
  count(filters: Omit<PhotoFilters, 'page' | 'limit'>): Promise<number>;
}

