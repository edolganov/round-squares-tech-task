import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { PgModule } from '../pg/pg.module';

@Module({
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
