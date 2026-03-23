import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { DateTimeFilterValues } from '@/features/admin/hooks/usePhotos';

interface DateTimeFiltersProps {
  applied: DateTimeFilterValues;
  onApply: (values: DateTimeFilterValues) => void;
  onClear: () => void;
}

export function DateTimeFilters({ applied, onApply, onClear }: DateTimeFiltersProps) {
  const [from, setFrom] = useState(applied.startDate ?? '');
  const [to, setTo] = useState(applied.endDate ?? '');

  function handleApply() {
    onApply({
      startDate: from.trim() === '' ? null : from,
      endDate: to.trim() === '' ? null : to,
    });
  }

  function handleClear() {
    setFrom('');
    setTo('');
    onClear();
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-white p-4 shadow-sm md:flex-row md:flex-wrap md:items-end">
      <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-sm font-medium text-text-secondary">
        De
        <input
          type="datetime-local"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-dark outline-none focus:ring-2 focus:ring-medium"
        />
      </label>
      <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-sm font-medium text-text-secondary">
        Até
        <input
          type="datetime-local"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-dark outline-none focus:ring-2 focus:ring-medium"
        />
      </label>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:w-auto">
        <Button type="button" onClick={handleApply} fullWidth={false} className="min-h-11 min-w-[8rem] py-3 text-base">
          Filtrar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          fullWidth={false}
          className="min-h-11 min-w-[8rem] py-3 text-base"
        >
          Limpar
        </Button>
      </div>
    </div>
  );
}
