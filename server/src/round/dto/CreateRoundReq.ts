import { ReqParam } from '../../common/meta/ReqParam';

export class CreateRoundReq {
  @ReqParam({ isDateString: true, isOptional: true })
  visibleTime?: string;
}
