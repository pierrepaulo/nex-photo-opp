import type { ReactNode } from 'react';

interface GradientBackgroundProps {
  children: ReactNode;
  className?: string;
}

export function GradientBackground({ children, className = '' }: GradientBackgroundProps) {
  return (
    <div
      className={`flex min-h-dvh items-center justify-center ${className}`}
      style={{ background: 'linear-gradient(150.64deg, #FFFFFF 49%, #999999 100%)' }}
    >
      <div className="flex min-h-dvh w-full max-w-[480px] flex-col items-center px-8">
        {children}
      </div>
    </div>
  );
}
