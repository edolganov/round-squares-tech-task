import { useEffect, useRef } from 'react';

export function useDataRef<T>(data: T) {
  const ref = useRef<T>(data);

  useEffect(() => {
    ref.current = data;
  }, [data, ref]);

  return ref;
}
