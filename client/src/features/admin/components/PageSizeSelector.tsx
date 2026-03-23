interface PageSizeSelectorProps {
  value: number;
  onChange: (size: number) => void;
}

const OPTIONS = [10, 20, 50] as const;

export function PageSizeSelector({ value, onChange }: PageSizeSelectorProps) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-text-secondary sm:flex-row sm:items-center sm:gap-3">
      <span className="whitespace-nowrap">Fotos por página</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-lg border border-border bg-white px-3 py-2 text-dark outline-none focus:ring-2 focus:ring-medium"
      >
        {OPTIONS.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </label>
  );
}
