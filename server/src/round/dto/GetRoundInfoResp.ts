import { ApiProperty } from '@nestjs/swagger';
import { RoundInfo } from './RoundInfo';

export class GetRoundInfoResp {
  @ApiProperty({ type: RoundInfo, required: false }) info?: RoundInfo;
}
