import { BadRequestException, Injectable } from '@nestjs/common';
import { DrizzleService } from '../infrastructure/drizzle/drizzle.service';
import { Round } from './dto/Round';
import { CreateRoundReq } from './dto/CreateRoundReq';
import { DateUtil } from '../common/utils/DateUtil';
import { Config } from '../config';
import { OneSec } from '../common/utils/date/const';
import { insertRound } from './orm/insertRound';
import { selectTopVisibleRounds } from './orm/selectTopVisibleRounds';
import { insertUserTapForValidRound } from './orm/insertUserTapForValidRound';
import { GetRoundInfoResp } from './dto/GetRoundInfoResp';
import { selectRound } from './orm/selectRound';
import { selectUserTapsCount } from './orm/selectUserTapsCount';
import { RoundStatService } from './round_stat.service';

@Injectable()
export class RoundService {
  constructor(
    protected orm: DrizzleService,
    protected roundStatService: RoundStatService,
  ) {}

  async createRound({
    visibleTime: visibleTimeVal,
  }: CreateRoundReq): Promise<Round> {
    const now = Date.now();
    const visibleTime = DateUtil.dateFrom(visibleTimeVal)?.getTime() || now;
    if (visibleTime < now) {
      throw new BadRequestException('invalid visibleTime value');
    }

    const startTime = visibleTime + Config.round.cooldownDurationSec * OneSec;
    const endTime = startTime + Config.round.roundDurationSec * OneSec;
    return await insertRound(this.orm, {
      visibleAt: new Date(visibleTime).toISOString(),
      startAt: new Date(startTime).toISOString(),
      endAt: new Date(endTime).toISOString(),
    });
  }

  async getTopVisibleRounds(): Promise<Round[]> {
    return selectTopVisibleRounds(this.orm, new Date(), 100);
  }

  async tapToActiveRound(roundId: string, userId: string): Promise<boolean> {
    return insertUserTapForValidRound(this.orm, roundId, userId);
  }

  async getRoundInfo(
    roundId: string,
    userId: string,
  ): Promise<GetRoundInfoResp> {
    const round = await selectRound(this.orm, roundId);
    if (!round) {
      return {};
    }

    const userTapsCount = await selectUserTapsCount(this.orm, userId, roundId);
    const userScore = RoundService.calculateScoreByTaps(userTapsCount);
    const winnerStat = await this.roundStatService.getWinnerInfoStat(roundId);

    return {
      info: {
        roundId,
        userScore,
        winner: winnerStat?.winner,
        winnerScore: winnerStat?.winnerScore,
        totalScore: winnerStat?.totalScore,
      },
    };
  }

  public static calculateScoreByTaps(tapsCount: number): number {
    const bonusTaps = Math.floor(tapsCount / 11);
    return tapsCount + 9 * bonusTaps;
  }
}
