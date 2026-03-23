import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  error?: string;
}

export function Input({ icon, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          className={`w-full rounded-lg bg-input-bg px-4 py-4 font-semibold text-text-placeholder-light shadow-md outline-none placeholder:text-text-placeholder ${icon ? 'pr-12' : ''} ${error ? 'ring-2 ring-red-500' : ''} ${className}`}
          {...props}
        />
        {icon && (
          <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-text-placeholder">
            {icon}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
