import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import { colorPath } from '@/infrastructure/material/colorPath.ts';
import { useIsMobile } from '@/hooks/theme/useIsMobile.ts';
import { useIsEmptyAuth } from '@/features/auth/hooks/useIsEmptyAuth.ts';
import { clearAuth, getLastLogin, setAuth } from '@/api/auth.ts';

export function AppCard({
  title,
  children,
  action,
  maxWidth,
  width,
}: {
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  maxWidth?: number;
  width?: number;
}) {
  const isMobile = useIsMobile();
  const isEmptyAuth = useIsEmptyAuth();

  return (
    <Card
      sx={{
        maxWidth: isMobile ? undefined : maxWidth || 900,
        width: isMobile ? '100%' : width || '100%',
      }}
    >
      <CardContent sx={{ position: 'relative' }}>
        <Typography
          gutterBottom
          sx={{
            mt: 1,
            color: colorPath('text.secondary'),
            fontSize: 16,
            fontWeight: 600,
            textAlign: isMobile ? 'left' : 'center',
          }}
        >
          {title}
        </Typography>
        {!isEmptyAuth && (
          <Stack
            direction="row"
            gap={1}
            sx={{
              position: 'absolute',
              top: 12,
              right: 8,
              alignItems: 'center',
            }}
          >
            <Typography sx={{ color: colorPath('text.secondary') }}>
              {getLastLogin()}
            </Typography>
            <Button onClick={() => clearAuth()} variant="text">
              Выход
            </Button>
          </Stack>
        )}
        <Divider sx={{ m: 1, mb: 4 }} />
        <Box sx={{ p: 1 }}>{children}</Box>
      </CardContent>
      <CardActions sx={{ px: 2.5, pb: 5, justifyContent: 'center' }}>
        {action}
      </CardActions>
    </Card>
  );
}
