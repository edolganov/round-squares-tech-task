import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from '../auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '../infrastructure/jwt/jwt.module';
import { RoundModule } from '../round/round.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    JwtModule /* for AuthGuard */,
    AuthModule,
    RoundModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
