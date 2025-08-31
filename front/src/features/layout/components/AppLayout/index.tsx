import React from 'react';
import { Box, Stack } from '@mui/material';
import { colorPath } from '@/infrastructure/material/colorPath.ts';
import { useIsDesktop } from '@/hooks/theme/useIsDesktop.ts';

interface Props {
  children?: React.ReactNode;
}

export function AppLayout({ children }: Props) {
  const isDesktop = useIsDesktop();
  return (
    <Box
      data-test="app-layout"
      sx={{
        minHeight: '100dvh',
        padding: isDesktop ? 8 : 0.5,
        backgroundColor: colorPath('grey.300'),
      }}
    >
      <Stack
        gap={0}
        sx={{
          maxWidth: 1200,
          margin: '0 auto',
          px: isDesktop ? 2 : 0,
          pb: 1,
          alignItems: 'center',
        }}
      >
        {children}
      </Stack>
    </Box>
  );
}
