import { AppCard } from '@/components/AppCard';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDoLogin } from '@/features/auth/hooks/useDoLogin.ts';
import { useSetFocusRef } from '@/hooks/ref/useSetFocusRef.ts';

export function AuthCard() {
  const { mutate: loginAction, isPending, isError } = useDoLogin();
  const { ref, focus } = useSetFocusRef();

  const [login, setLogin] = useState<string>('');
  const [psw, setPsw] = useState<string>('');
  const [wrongLogin, setWrongLogin] = useState(false);

  const isValid = !!login && !!psw && !wrongLogin;

  useEffect(() => {
    if (isError) {
      setWrongLogin(true);
      focus();
    }
  }, [focus, isError]);

  const doLogin = () => {
    if (login && psw) {
      loginAction({ login, psw });
    }
  };

  return (
    <AppCard
      title="ВОЙТИ"
      maxWidth={400}
      action={
        <>
          <Button
            variant="contained"
            disabled={!isValid}
            loading={isPending}
            loadingPosition="end"
            onClick={doLogin}
          >
            Войти
          </Button>
        </>
      }
    >
      <Stack gap={3}>
        <TextField
          inputRef={ref}
          required
          label="Логин"
          value={login}
          disabled={isPending}
          onChange={(event) => {
            setLogin(event.target.value);
            setWrongLogin(false);
          }}
          onKeyDown={(e) => (e.key === 'Enter' ? doLogin() : null)}
        />
        <TextField
          required
          type="password"
          label="Пароль"
          value={psw}
          disabled={isPending}
          onChange={(event) => {
            setPsw(event.target.value);
            setWrongLogin(false);
          }}
          onKeyDown={(e) => (e.key === 'Enter' ? doLogin() : null)}
        />
        {wrongLogin && (
          <Typography color="error" sx={{ textAlign: 'center' }}>
            Неверный логин или парль
          </Typography>
        )}
      </Stack>
    </AppCard>
  );
}
