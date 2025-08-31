import { useMutation } from '@tanstack/react-query';
import { type LoginReq } from '@/generated/api';
import { RestAuth, setAuth } from '@/api/auth.ts';

export function useDoLogin() {
  return useMutation({
    mutationFn: (req: LoginReq) => RestAuth.authConfirmAuth(req),
    onSuccess: (data, { login }) => {
      setAuth(data, login);
    },
  });
}
