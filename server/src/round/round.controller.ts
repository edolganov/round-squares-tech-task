import { Body, Controller, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoundService } from './round.service';
import { PostAuthAdmin } from '../common/meta/PostAuthAdmin';
import { Round } from './dto/Round';
import { CreateRoundReq } from './dto/CreateRoundReq';
import { GetNonAuth } from '../common/meta/GetNonAuth';
import { PostAuthSurvivor } from '../common/meta/PostAuthSurvivor';
import { TapResp } from './dto/TapResp';
import { TapReq } from './dto/TapReq';
import { AuthPayload } from '../auth/decorator';
import { JwtAuthPayload } from '../auth/types';
import { GetAuthSurvivor } from '../common/meta/GetAuthSurvivor';
import { GetRoundInfoReq } from './dto/GetRoundInfoReq';
import { GetRoundInfoResp } from './dto/GetRoundInfoResp';

@ApiTags('Round')
@Controller('v1/round')
export class RoundController {
  constructor(private readonly roundService: RoundService) {}

  @PostAuthAdmin({
    path: '',
    summary: 'Create round',
    respType: Round,
  })
  async createRound(@Body() data: CreateRoundReq): Promise<Round> {
    return this.roundService.createRound(data);
  }

  @GetNonAuth({
    path: 'top',
    summary: 'Get actual rounds',
    respType: Round,
    respArray: true,
  })
  async getTopRounds(): Promise<Round[]> {
    return this.roundService.getTopVisibleRounds();
  }

  @PostAuthSurvivor({
    path: 'tap',
    summary: 'Add tap to active round',
    respType: TapResp,
  })
  tapToRound(
    @AuthPayload() { userId, roles }: JwtAuthPayload,
    @Body() { roundId }: TapReq,
  ): TapResp {
    // skip spam requests from blocked user on the first place
    if (roles.includes('nikita')) {
      return {
        roundId,
        status: 'success',
      };
    }

    // async adding a tap event in server (for releasing response ASAP)
    this.roundService.tapToActiveRound(roundId, userId).catch(console.error);

    return {
      roundId,
      status: 'success',
    };
  }

  @GetAuthSurvivor({
    path: 'info',
    summary: 'Get round info for current user',
    respType: GetRoundInfoResp,
  })
  async getRoundInfo(
    @AuthPayload() { userId, roles }: JwtAuthPayload,
    @Query() { roundId }: GetRoundInfoReq,
  ): Promise<GetRoundInfoResp> {
    return this.roundService.getRoundInfo(roundId, userId);
  }
}
