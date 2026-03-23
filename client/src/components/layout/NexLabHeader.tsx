import logo from '@/assets/logo-nex-lab.svg';

interface NexLabHeaderProps {
  className?: string;
}

export function NexLabHeader({ className = '' }: NexLabHeaderProps) {
  return (
    <header className={`flex w-full justify-center pt-12 pb-8 ${className}`}>
      <img src={logo} alt="NEX.lab" className="h-10" />
    </header>
  );
}
