import { useCallback, useEffect, useMemo, useRef } from 'react';

export function useSetFocusRef(shouldFocus = true) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      setTimeout(() => {
        (ref.current as any)?.focus?.();
      }, 100);
    }
  }, [shouldFocus]);

  const focus = useCallback(() => {
    setTimeout(() => {
      (ref.current as any)?.focus?.();
    }, 100);
  }, []);

  return useMemo(
    () => ({
      ref,
      focus,
    }),
    [ref, focus],
  );
}
