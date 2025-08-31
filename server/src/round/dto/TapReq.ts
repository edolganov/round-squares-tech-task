import { ReqParam } from '../../common/meta/ReqParam';

export class TapReq {
  @ReqParam({ isUUID: true })
  roundId!: string;
}
