import { ApiProperty } from '@nestjs/swagger';

export class TapResp {
  @ApiProperty() roundId!: string;
  @ApiProperty() status!: string;
}
