import { Module } from '@nestjs/common';
import { RoundService } from './round.service';
import { RoundController } from './round.controller';
import { DrizzleModule } from '../infrastructure/drizzle/drizzle.module';
import { RoundStatService } from './round_stat.service';

@Module({
  imports: [DrizzleModule],
  controllers: [RoundController],
  providers: [RoundService, RoundStatService],
})
export class RoundModule {}
