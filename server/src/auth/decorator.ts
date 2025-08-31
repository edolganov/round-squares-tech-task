import {
  createParamDecorator,
  CustomDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Role } from '../common/model/role';
import { getAuthPayload } from './auth.guard';

export const AUTH_METADATA_KEY = 'Auth';

export const Auth = (
  ...roles: Role[]
): CustomDecorator<typeof AUTH_METADATA_KEY> =>
  SetMetadata(AUTH_METADATA_KEY, roles?.length > 0 ? roles : []);

export const AuthPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return getAuthPayload(req);
  },
);
