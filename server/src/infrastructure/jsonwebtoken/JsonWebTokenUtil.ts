import { SignOptions } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { promisify } from 'util';

export const jwtSign = <
  (payload: any, secret: string, options: SignOptions) => Promise<string>
>(promisify as any)(jwt.sign);
export const jwtVerify = <(token: string, secret: string) => Promise<any>>(
  promisify(jwt.verify)
);

export const jwtDecode = jwt.decode;
