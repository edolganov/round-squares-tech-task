import type { Theme } from '@mui/material/styles';

export function mediaMobile(theme: Theme) {
  return theme.breakpoints.down('md');
}
