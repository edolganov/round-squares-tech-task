import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { mediaMobile } from '@/infrastructure/material/mediaMobile.ts';

export const LabelValueRoot = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  [mediaMobile(theme)]: {
    maxWidth: 'initial',
  },
}));
