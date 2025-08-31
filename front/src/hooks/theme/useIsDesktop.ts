import { useIsMobile } from '@/hooks/theme/useIsMobile.ts';

export function useIsDesktop() {
  return !useIsMobile();
}
