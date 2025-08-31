import { ApiProperty } from '@nestjs/swagger';

export class LoginResp {
  @ApiProperty() token!: string;
}
