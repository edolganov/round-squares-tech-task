import type { Theme } from '@mui/material/styles';

export function mediaDesktop(theme: Theme) {
  return theme.breakpoints.up('md');
}
