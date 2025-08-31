import { BadRequestException, Injectable } from '@nestjs/common';
import { DrizzleService } from '../infrastructure/drizzle/drizzle.service';
import { JwtAuthPayload } from './types';
import { JwtService } from '../infrastructure/jwt/jwt.service';
import { LoginResp } from './dto/LoginResp';
import { LoginReq } from './dto/LoginReq';
import { hashSha256Base64 } from '../common/utils/crypto/hashSha256Base64';
import { Util } from '../common/utils/Util';
import { selectUserWithRoles } from './orm/selectUserWithRoles';
import { insertUserWithRolesTx } from './orm/insertUserWithRolesTx';
import { Role } from '../common/model/role';
import { selectDefaultUserRoles } from './orm/selectDefaultUserRoles';

@Injectable()
export class AuthService {
  constructor(
    protected orm: DrizzleService,
    protected jwtService: JwtService,
  ) {}

  async login({ login, psw }: LoginReq): Promise<LoginResp> {
    const curUser = await selectUserWithRoles(this.orm, login);
    let userRoles: Role[];
    let userId: string;

    // new user
    if (!curUser) {
      const newPswSalt = Util.uuid();
      const newPswHash = AuthService.getHash(psw, newPswSalt);
      userRoles = await selectDefaultUserRoles(this.orm, login);
      const newUser = await insertUserWithRolesTx(
        this.orm,
        {
          login,
          pswHash: newPswHash,
          pswSalt: newPswSalt,
        },
        userRoles,
      );
      userId = newUser.id;
    }
    // exists user
    else {
      const validHash = curUser.pswHash;
      const hashToCheck = AuthService.getHash(psw, curUser.pswSalt);
      if (hashToCheck !== validHash) {
        throw new BadRequestException('Invalid user login or password');
      }
      userRoles = curUser.appUserRoles;
      userId = curUser.id;
    }

    const token = await this.jwtService.createJwtToken<JwtAuthPayload>({
      userId,
      login,
      roles: userRoles,
    });

    return {
      token,
    };
  }

  static getHash(psw: string, salt: string) {
    return hashSha256Base64(`${salt}${psw}`);
  }
}
