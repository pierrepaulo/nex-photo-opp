import { AdminPhotoListItemDTO } from '@/application/dtos/AdminPhotoListItemDTO';
import { IPhotoRepository, PhotoFilters } from '@/domain/repositories/IPhotoRepository';

export interface ListPhotosInput {
  page: number;
  limit: number;
  startDate?: Date;
  endDate?: Date;
}

export interface ListPhotosOutput {
  photos: AdminPhotoListItemDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListPhotosUseCase {
  constructor(private readonly photoRepository: IPhotoRepository) {}

  async execute(input: ListPhotosInput): Promise<ListPhotosOutput> {
    const filters: PhotoFilters = {
      page: input.page,
      limit: input.limit,
      startDate: input.startDate,
      endDate: input.endDate,
    };

    const [rows, total] = await Promise.all([
      this.photoRepository.findMany(filters),
      this.photoRepository.count({
        startDate: input.startDate,
        endDate: input.endDate,
      }),
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / input.limit);

    const photos: AdminPhotoListItemDTO[] = rows.map((p) => ({
      id: p.id,
      framedUrl: p.framedUrl,
      downloadToken: p.downloadToken,
      createdAt: p.createdAt.toISOString(),
    }));

    return {
      photos,
      total,
      page: input.page,
      limit: input.limit,
      totalPages,
    };
  }
}
