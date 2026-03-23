import { IPhotoRepository } from '@/domain/repositories/IPhotoRepository';

export interface GetPhotoStatsInput {
  startDate?: Date;
  endDate?: Date;
}

export interface GetPhotoStatsOutput {
  totalPhotos: number;
  filteredPhotos: number;
}

export class GetPhotoStatsUseCase {
  constructor(private readonly photoRepository: IPhotoRepository) {}

  async execute(input: GetPhotoStatsInput): Promise<GetPhotoStatsOutput> {
    const [totalPhotos, filteredPhotos] = await Promise.all([
      this.photoRepository.count({}),
      this.photoRepository.count({
        startDate: input.startDate,
        endDate: input.endDate,
      }),
    ]);

    return { totalPhotos, filteredPhotos };
  }
}
