import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Pagination } from '@/components/ui/Pagination';
import { PageSizeSelector } from '@/features/admin/components/PageSizeSelector';
import type { Log } from '@/types';

interface LogsTableProps {
  logs: Log[];
  isLoading: boolean;
  isExporting: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onExportCsv: () => void;
}

function formatCellDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR');
  } catch {
    return iso;
  }
}

export function LogsTable({
  logs,
  isLoading,
  isExporting,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onExportCsv,
}: LogsTableProps) {
  return (
    <section className="rounded-xl border border-border bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-dark sm:text-xl">Registro de atividades</h2>
          <p className="mt-1 text-sm text-text-secondary">Requisições e eventos de autenticação (IP mascarado)</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-lg border border-border bg-surface px-3 py-2">
            <PageSizeSelector
              value={pageSize}
              onChange={onPageSizeChange}
              label="Registros por página"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            fullWidth={false}
            disabled={isExporting}
            onClick={() => onExportCsv()}
            className="min-h-11 shrink-0 px-6 py-3 text-base"
          >
            {isExporting ? 'Gerando…' : 'Download CSV'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[12rem] items-center justify-center p-8">
          <LoadingSpinner className="text-medium" />
        </div>
      ) : logs.length === 0 ? (
        <div className="p-10 text-center text-sm text-text-secondary">Nenhum log para os filtros atuais.</div>
      ) : (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead className="border-b border-border bg-surface/80 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                <tr>
                  <th className="px-4 py-3">Data/Hora</th>
                  <th className="px-4 py-3">Usuário</th>
                  <th className="px-4 py-3">IP</th>
                  <th className="px-4 py-3">Rota</th>
                  <th className="px-4 py-3">Método</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface/40">
                    <td className="whitespace-nowrap px-4 py-3 text-text-primary">{formatCellDate(log.createdAt)}</td>
                    <td className="max-w-[10rem] truncate px-4 py-3" title={log.userName}>
                      {log.userName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{log.ipAddress}</td>
                    <td className="max-w-xs truncate px-4 py-3 font-mono text-xs" title={log.route}>
                      {log.route}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{log.method}</td>
                    <td className="whitespace-nowrap px-4 py-3">{log.responseStatus}</td>
                    <td className="max-w-[12rem] truncate px-4 py-3 text-xs" title={log.actionType}>
                      {log.actionType}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-border lg:hidden">
            {logs.map((log) => (
              <li key={log.id} className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-text-muted">Data/Hora</span>
                  <span className="text-right text-sm text-text-primary">{formatCellDate(log.createdAt)}</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <span className="text-text-secondary">Usuário:</span>
                  <span className="font-medium text-dark">{log.userName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                  <div>
                    <span className="text-text-muted">IP</span>
                    <p className="font-mono">{log.ipAddress}</p>
                  </div>
                  <div>
                    <span className="text-text-muted">Método</span>
                    <p>{log.method}</p>
                  </div>
                  <div>
                    <span className="text-text-muted">Status</span>
                    <p>{log.responseStatus}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-text-muted">Rota</span>
                  <p className="break-all font-mono text-xs">{log.route}</p>
                </div>
                <div>
                  <span className="text-xs text-text-muted">Ação</span>
                  <p className="text-sm">{log.actionType}</p>
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 0 ? (
            <div className="border-t border-border p-4">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
