import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_METADATA_KEY } from './decorator';
import { JwtAuthPayload } from './types';
import { Util } from '../common/utils/Util';
import { JwtService } from '../infrastructure/jwt/jwt.service';
import { StringUtil } from '../common/utils/StringUtil';
import { Request } from 'express';
import { Role } from '../common/model/role';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const httpCtx = context.switchToHttp();
    const req: Request & { extra: any } = httpCtx.getRequest();

    req.extra = req.extra || {};

    const validRoles = this.reflector.get<Role[]>(
      AUTH_METADATA_KEY,
      context.getHandler(),
    );

    if (!validRoles || validRoles.length === 0) return true;

    const fromHeader = req.headers.authorization;
    const encodedToken = fromHeader
      ? StringUtil.removeBegin(fromHeader, 'Bearer ', 'bearer ')
      : undefined;

    // save access token for any logic
    req.extra.accessToken = encodedToken;

    const token = encodedToken
      ? await this.jwtService.parseJwtToken<JwtAuthPayload>(encodedToken)
      : undefined;
    if (!token) {
      if (!Util.isBlank(encodedToken))
        return false; // 403
      else throw new UnauthorizedException(); // 401
    }

    const reqRoles = token.roles;
    const hasValidRole = isValidRoles(reqRoles, validRoles);

    if (hasValidRole) {
      req.extra.authPayload = token;
    }

    return hasValidRole;
  }
}

function isValidRoles(reqRoles: string[], validRoles: string[]) {
  return !!reqRoles.find((role) =>
    validRoles.find((validRole) => validRole === role),
  );
}

export function getAuthPayload(req: any): JwtAuthPayload | undefined {
  return req.extra?.authPayload;
}
