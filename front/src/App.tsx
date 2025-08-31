import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { HomePage } from '@/pages/HomePage';
import { OneMin } from '@/common/utils/date/const.ts';
import { AppLayout } from '@/features/layout/components/AppLayout';
import { RoundsCard } from '@/features/round/components/RoundsCard';
import { AuthRedirect } from '@/features/auth/components/AuthRedirect';
import { RoundGamePage } from '@/pages/RoundGamePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: OneMin,
      refetchOnWindowFocus: true,
    },
  },
});

const theme = createTheme({
  typography: {
    button: {
      textTransform: 'none',
    },
  },
});

export function App() {
  return (
    <StrictMode>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <AuthRedirect>
              <AppLayout>
                <Routes>
                  <Route index element={<HomePage />} />
                  <Route path="rounds" element={<RoundsCard />} />
                  <Route path="rounds/:roundId" element={<RoundGamePage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </AppLayout>
            </AuthRedirect>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
