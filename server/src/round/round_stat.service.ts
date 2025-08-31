import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../infrastructure/drizzle/drizzle.service';
import { DateUtil } from '../common/utils/DateUtil';
import { selectRound } from './orm/selectRound';
import { WinnerInfo } from './types';
import { selectAllUsersTapsCount } from './orm/selectAllUsersTapsCount';
import { updateRoundStatWinner } from './orm/updateRoundStatWinner';
import { RoundService } from './round.service';
import { Util } from '../common/utils/Util';

const log = Util.getLog('RoundStatService');

@Injectable()
export class RoundStatService {
  private inCalcWinners = new Set<string>();

  constructor(protected orm: DrizzleService) {}

  async getWinnerInfoStat(roundId: string): Promise<WinnerInfo | undefined> {
    const round = await selectRound(this.orm, roundId);
    if (!round) {
      return undefined;
    }

    const endAt = DateUtil.dateFrom(round.endAt);
    if (!endAt || endAt.getTime() > Date.now()) {
      return undefined;
    }

    // already has stat in DB
    if (round.statWinner !== null) {
      return {
        winner: round.statWinner,
        winnerScore: round.statWinnerScore || 0,
        totalScore: round.statTotalScore || 0,
      };
    }

    // add async task to calc winner stat in DB
    this.calcWinner(roundId).catch(console.error);
    return undefined;
  }

  private async calcWinner(roundId: string) {
    if (this.inCalcWinners.has(roundId)) {
      return;
    }

    this.inCalcWinners.add(roundId);
    try {
      const allUsers = await selectAllUsersTapsCount(this.orm, roundId);
      const topUser = allUsers.length > 0 ? allUsers[0] : undefined;

      const totalScore = allUsers
        .map((data) => RoundService.calculateScoreByTaps(data.tapCount))
        .reduce((prev, cur) => prev + cur, 0);

      const topScore = RoundService.calculateScoreByTaps(
        topUser?.tapCount || 0,
      );
      const updated = await updateRoundStatWinner(this.orm, roundId, {
        winner: topUser?.userLogin || '',
        winnerScore: topScore,
        totalScore,
      });

      if (updated) {
        log.info('added winner stat for round', roundId);
      } else {
        log.warn('cannot add winner stat for round', roundId);
      }
    } finally {
      this.inCalcWinners.delete(roundId);
    }
  }
}
