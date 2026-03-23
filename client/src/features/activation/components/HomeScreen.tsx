import { GradientBackground } from '@/components/layout/GradientBackground';
import { NexLabHeader } from '@/components/layout/NexLabHeader';
import { Button } from '@/components/ui/Button';

interface HomeScreenProps {
  onStart: () => void;
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <GradientBackground>
      <div className="flex min-h-dvh w-full flex-col">
        <NexLabHeader />
        <div className="flex flex-1 flex-col items-center justify-center px-2">
          <h1 className="text-center text-[clamp(2rem,10vw,3rem)] font-bold leading-tight text-dark sm:text-5xl">
            Photo Opp
          </h1>
        </div>
        <div className="mt-auto w-full pb-10">
          <Button type="button" onClick={onStart}>
            Iniciar
          </Button>
        </div>
      </div>
    </GradientBackground>
  );
}
