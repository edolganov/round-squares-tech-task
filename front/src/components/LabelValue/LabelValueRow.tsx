import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  labelText?: ReactNode;
  labelElem?: ReactNode;
  valueText?: ReactNode;
  valueElem?: ReactNode;
  labelGap?: number | string;
}

export function LabelValueRow({
  labelElem,
  labelText,
  valueElem,
  valueText,
  labelGap,
}: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}
    >
      {!labelText && labelElem}
      {!labelElem && (
        <Typography color="text.secondary">{labelText}</Typography>
      )}
      {labelElem && labelText && (
        <Box
          sx={{ display: 'flex', gap: labelGap ?? 1, alignItems: 'baseline' }}
        >
          <Typography color="text.secondary">{labelText}</Typography>
          {labelElem}
        </Box>
      )}

      {valueText && !valueElem && (
        <Typography sx={{ fontWeight: 'medium' }}>{valueText}</Typography>
      )}
      {valueElem}
    </Box>
  );
}
