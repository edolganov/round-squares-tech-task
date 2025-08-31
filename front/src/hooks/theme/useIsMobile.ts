import { useMediaQuery } from '@mui/material';

export function useIsMobile() {
  return useMediaQuery((theme) => theme.breakpoints.down('md'));
}
