import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResp } from './dto/LoginResp';
import { PostNonAuth } from '../common/meta/PostNonAuth';
import { LoginReq } from './dto/LoginReq';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PostNonAuth({
    path: 'login',
    summary: 'Login to system',
    respType: LoginResp,
  })
  async confirmAuth(@Body() loginReq: LoginReq) {
    return this.authService.login(loginReq);
  }
}
