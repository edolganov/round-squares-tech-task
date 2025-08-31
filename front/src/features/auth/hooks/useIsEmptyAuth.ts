import { addAuthListener, hasAuth, removeAuthListener } from '@/api/auth.ts';
import { useEffect, useState } from 'react';

export function useIsEmptyAuth() {
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    const handler = {
      onAuthUpdated: () => {
        setForceUpdate((val) => val + 1);
      },
    };
    addAuthListener(handler);
    return () => {
      removeAuthListener(handler);
    };
  }, []);

  return !hasAuth();
}
