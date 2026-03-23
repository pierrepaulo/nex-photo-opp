import { type FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GradientBackground } from '@/components/layout/GradientBackground';
import { NexLabHeader } from '@/components/layout/NexLabHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAuthStore } from '@/features/auth/store/authStore';
import { consumeLoginFlashMessage } from '@/services/loginFlash';
import { Role } from '@/types';

function EmailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sessionNotice] = useState<string | null>(() => consumeLoginFlashMessage());
  const { login, isLoading, error } = useAuth();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === Role.ADMIN ? '/admin' : '/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const loggedUser = await login(email, password);
      navigate(loggedUser.role === Role.ADMIN ? '/admin' : '/', { replace: true });
    } catch {
      // error is handled by useAuth hook
    }
  }

  return (
    <GradientBackground>
      <NexLabHeader />

      <div className="flex flex-1 flex-col items-center justify-center w-full">
        <h1 className="mb-10 text-4xl font-bold text-dark">Login</h1>

        {sessionNotice ? (
          <p
            className="mb-6 w-full max-w-md rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900"
            role="status"
          >
            {sessionNotice}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<EmailIcon />}
            required
            autoComplete="email"
          />

          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<LockIcon />}
            required
            autoComplete="current-password"
          />

          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}

          <div className="mt-4">
            <Button type="submit" isLoading={isLoading}>
              Entrar
            </Button>
          </div>
        </form>
      </div>
    </GradientBackground>
  );
}
