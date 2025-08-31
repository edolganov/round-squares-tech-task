import { ReqParam } from '../../common/meta/ReqParam';

export class LoginReq {
  @ReqParam({ isString: true })
  login!: string;

  @ReqParam({ isString: true })
  psw!: string;
}
