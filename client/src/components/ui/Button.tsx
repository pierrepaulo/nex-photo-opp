import type { ButtonHTMLAttributes } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  isLoading = false,
  fullWidth = true,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'min-h-11 rounded-lg py-4 px-6 font-bold text-lg transition-colors duration-200 cursor-pointer';
  const width = fullWidth ? 'w-full' : '';
  const variants = {
    primary: 'bg-medium text-white hover:bg-dark disabled:opacity-50 disabled:cursor-not-allowed',
    outline:
      'border-2 border-medium text-medium bg-transparent hover:bg-medium hover:text-white disabled:opacity-50 disabled:cursor-not-allowed',
  };

  return (
    <button
      className={`${base} ${width} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <LoadingSpinner size="sm" className="text-current" />
          <span>Carregando...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
