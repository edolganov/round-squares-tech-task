import { Module } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';
import { PgModule } from '../pg/pg.module';

@Module({
  imports: [PgModule],
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DrizzleModule {}
