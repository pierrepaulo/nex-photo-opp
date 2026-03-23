interface CountdownOverlayProps {
  value: number;
}

export function CountdownOverlay({ value }: CountdownOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/35">
      <div
        key={value}
        className="animate-countdown-pop font-bold text-white"
        style={{ fontSize: 'clamp(6rem, 28vw, 12.5rem)' }}
      >
        {value}
      </div>
    </div>
  );
}
