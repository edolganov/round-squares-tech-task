import { useEffect } from 'react';

const AppName = 'The Last of Guss';

export function usePageTitle(prefix: string) {
  useEffect(() => {
    document.title = `${prefix} – ${AppName}`;
    return () => {
      document.title = AppName;
    };
  }, [prefix]);
}
