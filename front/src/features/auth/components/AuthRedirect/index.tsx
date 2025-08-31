import { type ReactNode, useEffect } from 'react';
import { useIsEmptyAuth } from '@/features/auth/hooks/useIsEmptyAuth.ts';
import { useNavigate } from 'react-router';

export function AuthRedirect({ children }: { children: ReactNode }) {
  const isEmptyAuth = useIsEmptyAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEmptyAuth) {
      navigate('/');
    }
  }, [isEmptyAuth, navigate]);

  return <>{children}</>;
}
