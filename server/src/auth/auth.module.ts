import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DrizzleModule } from '../infrastructure/drizzle/drizzle.module';
import { JwtModule } from '../infrastructure/jwt/jwt.module';

@Module({
  imports: [DrizzleModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
