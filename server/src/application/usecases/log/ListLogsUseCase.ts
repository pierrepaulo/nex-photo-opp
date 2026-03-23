import { LogResponseDTO } from '@/application/dtos/LogResponseDTO';
import { LogListFilters } from '@/application/dtos/LogListQueryDTO';
import { ILogRepository, LogFilters, LogWithUserEmail } from '@/domain/repositories/ILogRepository';

export interface ListLogsOutput {
  logs: LogResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function toDto(row: LogWithUserEmail): LogResponseDTO {
  return {
    id: row.id,
    userId: row.userId,
    userName: row.userEmail ?? 'Anonimo',
    ipAddress: row.ipAddress,
    method: row.method,
    route: row.route,
    requestBody: row.requestBody,
    responseStatus: row.responseStatus,
    actionType: row.actionType,
    userAgent: row.userAgent,
    createdAt: row.createdAt.toISOString(),
  };
}

export class ListLogsUseCase {
  constructor(private readonly logRepository: ILogRepository) {}

  async execute(input: LogListFilters): Promise<ListLogsOutput> {
    const filters: LogFilters = {
      page: input.page,
      limit: input.limit,
      startDate: input.startDate,
      endDate: input.endDate,
    };

    const [rows, total] = await Promise.all([
      this.logRepository.findMany(filters),
      this.logRepository.count({
        startDate: input.startDate,
        endDate: input.endDate,
      }),
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / input.limit);

    return {
      logs: rows.map(toDto),
      total,
      page: input.page,
      limit: input.limit,
      totalPages,
    };
  }
}
