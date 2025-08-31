import { useMemo, useRef } from 'react';

export function useBlockRef() {
  const ref = useRef(false);

  return useMemo(
    () => ({
      ref,
      isBlocked: () => ref.current,
      blockRef: (timeout = 100) => {
        ref.current = true;
        setTimeout(() => {
          ref.current = false;
        }, timeout);
      },
    }),
    [],
  );
}
