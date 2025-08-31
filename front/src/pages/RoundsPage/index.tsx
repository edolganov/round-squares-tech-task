import { usePageTitle } from '@/hooks/usePageTitle.ts';
import { RoundsCard } from '@/features/round/components/RoundsCard';

export function RoundsPage() {
  usePageTitle('Список РАУНДОВ');
  return <RoundsCard />;
}
