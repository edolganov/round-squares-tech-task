import { usePageTitle } from '@/hooks/usePageTitle.ts';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { useIsEmptyAuth } from '@/features/auth/hooks/useIsEmptyAuth.ts';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function HomePage() {
  usePageTitle('Войти');

  const isEmptyAuth = useIsEmptyAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isEmptyAuth) {
      navigate('/rounds');
    }
  }, [isEmptyAuth, navigate]);

  return <AuthCard />;
}
