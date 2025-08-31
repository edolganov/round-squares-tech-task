import { ReqParam } from '../../common/meta/ReqParam';

export class GetRoundInfoReq {
  @ReqParam({ isUUID: true })
  roundId!: string;
}
