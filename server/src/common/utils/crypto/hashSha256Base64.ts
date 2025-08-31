import * as crypto from 'crypto';

export function hashSha256Base64(msg: string) {
  return crypto.createHash('sha256').update(msg).digest('base64');
}
