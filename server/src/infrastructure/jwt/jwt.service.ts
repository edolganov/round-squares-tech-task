import { Injectable } from '@nestjs/common';
import { jwtSign, jwtVerify } from '../jsonwebtoken/JsonWebTokenUtil';
import { Config } from '../../config';
import { StringValue } from 'ms';
import { Util } from '../../common/utils/Util';
import { JwtDefaultPayload } from './types';

const log = Util.getLog('JwtService');

@Injectable()
export class JwtService {
  constructor() {}

  async createJwtToken<T extends Record<any, any>>(
    payload: T,
    options?: {
      subject?: string;
      issuer?: string;
      expiresIn?: StringValue | number;
      audience?: string;
    },
  ): Promise<string> {
    options = {
      subject: 'auth',
      issuer: 'p2ex',
      expiresIn: Config.jwt.defaultTtl,
      ...(options || {}),
    };

    return jwtSign(payload, Config.jwt.privateKey, options);
  }

  async parseJwtToken<T>(
    encodedToken: string,
  ): Promise<(T & JwtDefaultPayload) | undefined> {
    try {
      return await jwtVerify(encodedToken, Config.jwt.privateKey);
    } catch (err: any) {
      // unexpected error
      if (!err.name) log.error(`cannot verify token`, err);
      return undefined;
    }
  }
}
