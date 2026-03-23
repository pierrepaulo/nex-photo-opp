import { GradientBackground } from '@/components/layout/GradientBackground';
import { NexLabHeader } from '@/components/layout/NexLabHeader';

export function ActivationPage() {
  return (
    <GradientBackground>
      <NexLabHeader />
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-dark">Photo Opp</h1>
        <p className="mt-4 text-text-secondary">Fluxo de ativacao — em breve</p>
      </div>
    </GradientBackground>
  );
}
