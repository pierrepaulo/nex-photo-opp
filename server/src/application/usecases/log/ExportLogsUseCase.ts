import { LogExportFilters } from '@/application/dtos/LogListQueryDTO';
import { ILogRepository } from '@/domain/repositories/ILogRepository';

/** Limite de linhas no CSV para evitar estouro de memoria. */
const MAX_EXPORT_ROWS = 50_000;

function escapeCsvCell(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatDateBr(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  return d.toLocaleString('pt-BR', { timeZone: 'UTC' });
}

export class ExportLogsUseCase {
  constructor(private readonly logRepository: ILogRepository) {}

  async execute(filters: LogExportFilters): Promise<string> {
    const rows = await this.logRepository.findManyForExport(
      {
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
      MAX_EXPORT_ROWS,
    );

    const header = [
      'Data/Hora',
      'Usuario',
      'IP',
      'Metodo',
      'Rota',
      'Body',
      'Status',
      'Acao',
    ];

    const lines = [
      header.map(escapeCsvCell).join(','),
      ...rows.map((r) =>
        [
          escapeCsvCell(formatDateBr(r.createdAt.toISOString())),
          escapeCsvCell(r.userEmail ?? 'Anonimo'),
          escapeCsvCell(r.ipAddress),
          escapeCsvCell(r.method),
          escapeCsvCell(r.route),
          escapeCsvCell(r.requestBody ?? ''),
          escapeCsvCell(String(r.responseStatus)),
          escapeCsvCell(r.actionType),
        ].join(','),
      ),
    ];

    const csv = lines.join('\r\n');
    return `\uFEFF${csv}`;
  }
}
